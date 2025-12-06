/**
 * Form Tracking Utilities
 * Automatically captures device, browser, and location data for form submissions
 */

export interface FormTrackingData {
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  browser: string;
  browserVersion: string;
  os: string;
  screenResolution: string;
  timezone: string;
  timestamp: Date;
  userAgent: string;
  referrer: string;
  language: string;
  // Location data (approximate, from IP or browser)
  approximateLocation?: {
    city?: string;
    region?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
}

/**
 * Detect device type based on screen width and user agent
 */
function detectDeviceType(): 'mobile' | 'tablet' | 'desktop' | 'unknown' {
  if (typeof window === 'undefined') return 'unknown';
  
  const width = window.innerWidth;
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Check for mobile devices
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
    return 'mobile';
  }
  
  // Check for tablets
  if (/tablet|ipad|playbook|silk/i.test(userAgent) || (width >= 768 && width <= 1024)) {
    return 'tablet';
  }
  
  // Check by screen width
  if (width < 768) {
    return 'mobile';
  } else if (width >= 768 && width < 1024) {
    return 'tablet';
  }
  
  return 'desktop';
}

/**
 * Detect browser name and version
 */
function detectBrowser(): { name: string; version: string } {
  if (typeof window === 'undefined') {
    return { name: 'unknown', version: 'unknown' };
  }
  
  const userAgent = navigator.userAgent;
  let browserName = 'unknown';
  let browserVersion = 'unknown';
  
  // Chrome
  if (/Chrome/.test(userAgent) && !/Edg/.test(userAgent)) {
    browserName = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+\.\d+)/);
    browserVersion = match ? match[1] : 'unknown';
  }
  // Edge
  else if (/Edg/.test(userAgent)) {
    browserName = 'Edge';
    const match = userAgent.match(/Edg\/(\d+\.\d+)/);
    browserVersion = match ? match[1] : 'unknown';
  }
  // Firefox
  else if (/Firefox/.test(userAgent)) {
    browserName = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
    browserVersion = match ? match[1] : 'unknown';
  }
  // Safari
  else if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
    browserName = 'Safari';
    const match = userAgent.match(/Version\/(\d+\.\d+)/);
    browserVersion = match ? match[1] : 'unknown';
  }
  // Opera
  else if (/OPR/.test(userAgent)) {
    browserName = 'Opera';
    const match = userAgent.match(/OPR\/(\d+\.\d+)/);
    browserVersion = match ? match[1] : 'unknown';
  }
  
  return { name: browserName, version: browserVersion };
}

/**
 * Detect operating system
 */
function detectOS(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  const userAgent = navigator.userAgent;
  
  if (/Windows NT 10/.test(userAgent)) return 'Windows 10';
  if (/Windows NT 11/.test(userAgent)) return 'Windows 11';
  if (/Windows/.test(userAgent)) return 'Windows';
  if (/Mac OS X/.test(userAgent)) return 'macOS';
  if (/Linux/.test(userAgent)) return 'Linux';
  if (/Android/.test(userAgent)) return 'Android';
  if (/iOS|iPhone|iPad|iPod/.test(userAgent)) return 'iOS';
  
  return 'unknown';
}

/**
 * Fetch with timeout helper for mobile networks
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 3000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Get approximate location using browser's geolocation API
 * Returns a promise that resolves with location data or null
 * Optimized for mobile devices with shorter timeouts and better error handling
 */
async function getApproximateLocation(): Promise<{
  city?: string;
  region?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
} | null> {
  // Skip location tracking entirely if on server-side
  if (typeof window === 'undefined') {
    return null;
  }

  // Try to get location from browser geolocation API with a shorter timeout for mobile
  if ('geolocation' in navigator) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        // Use shorter timeout for mobile (3 seconds instead of 5)
        const timeoutId = setTimeout(() => {
          reject(new Error('Geolocation timeout'));
        }, 3000);
        
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            clearTimeout(timeoutId);
            resolve(pos);
          },
          (err) => {
            clearTimeout(timeoutId);
            reject(err);
          },
          {
            timeout: 3000,
            maximumAge: 300000, // Cache for 5 minutes
            enableHighAccuracy: false, // Use low accuracy for faster response on mobile
          }
        );
      });
      
      // Use reverse geocoding API to get city/region/country
      // Use a shorter timeout for the API call
      try {
        const response = await fetchWithTimeout(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`,
          {},
          3000
        );
        
        if (!response.ok) {
          throw new Error('Geocoding API error');
        }
        
        const data = await response.json();
        
        return {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          city: data.address?.city || data.address?.town || data.address?.village,
          region: data.address?.state,
          country: data.address?.country,
        };
      } catch (error) {
        // If reverse geocoding fails, return just coordinates
        return {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      }
    } catch (error) {
      // Geolocation denied or failed - this is expected on mobile
      console.log('Geolocation not available:', error);
    }
  }
  
  // Fallback: Try to get approximate location from IP using a free service
  // Use a very short timeout since this often fails on mobile networks
  try {
    const response = await fetchWithTimeout('https://ipapi.co/json/', {}, 2000);
    
    if (!response.ok) {
      throw new Error('IP API error');
    }
    
    const data = await response.json();
    
    // Validate the response has expected fields
    if (data && (data.city || data.country_name)) {
      return {
        city: data.city,
        region: data.region,
        country: data.country_name,
        latitude: data.latitude,
        longitude: data.longitude,
      };
    }
  } catch (error) {
    // IP-based location often fails on mobile - this is expected
    console.log('IP-based location not available:', error);
  }
  
  return null;
}

/**
 * Capture all tracking data for a form submission
 * Optimized for mobile devices with better error handling and timeouts
 */
export async function captureFormTrackingData(): Promise<FormTrackingData> {
  const browser = detectBrowser();
  
  // Build basic tracking data first (synchronous, always works)
  const trackingData: FormTrackingData = {
    deviceType: detectDeviceType(),
    browser: browser.name,
    browserVersion: browser.version,
    os: detectOS(),
    screenResolution: typeof window !== 'undefined' 
      ? `${window.screen.width}x${window.screen.height}` 
      : 'unknown',
    timezone: 'unknown',
    timestamp: new Date(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    referrer: typeof document !== 'undefined' ? (document.referrer || 'direct') : 'direct',
    language: typeof navigator !== 'undefined' ? navigator.language : 'unknown',
  };
  
  // Safely get timezone (can fail on some mobile browsers)
  try {
    trackingData.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown';
  } catch (e) {
    trackingData.timezone = 'unknown';
  }
  
  // Try to get location data, but don't let it block form submission
  // Use Promise.race with a timeout to ensure we don't wait too long
  try {
    const locationPromise = getApproximateLocation();
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 4000));
    
    const location = await Promise.race([locationPromise, timeoutPromise]);
    
    if (location) {
      trackingData.approximateLocation = location;
    }
  } catch (error) {
    // Location tracking failed - this is fine, continue without it
    console.log('Location tracking skipped:', error);
  }
  
  return trackingData;
}

/**
 * Format tracking data for display in admin panel
 */
export function formatTrackingDataForDisplay(trackingData: FormTrackingData): string {
  const parts = [
    `Device: ${trackingData.deviceType}`,
    `Browser: ${trackingData.browser} ${trackingData.browserVersion}`,
    `OS: ${trackingData.os}`,
    `Screen: ${trackingData.screenResolution}`,
    `Timezone: ${trackingData.timezone}`,
    `Language: ${trackingData.language}`,
  ];
  
  if (trackingData.approximateLocation) {
    const loc = trackingData.approximateLocation;
    const locationParts = [loc.city, loc.region, loc.country].filter(Boolean);
    if (locationParts.length > 0) {
      parts.push(`Location: ${locationParts.join(', ')}`);
    }
  }
  
  if (trackingData.referrer && trackingData.referrer !== 'direct') {
    parts.push(`Referrer: ${trackingData.referrer}`);
  }
  
  return parts.join(' | ');
}

/**
 * Get analytics summary from multiple form submissions
 */
export function getFormAnalytics(submissions: Array<{ trackingData?: FormTrackingData }>) {
  const deviceCounts = { mobile: 0, tablet: 0, desktop: 0, unknown: 0 };
  const browserCounts: Record<string, number> = {};
  const osCounts: Record<string, number> = {};
  const locationCounts: Record<string, number> = {};
  
  submissions.forEach(submission => {
    if (!submission.trackingData) return;
    
    const data = submission.trackingData;
    
    // Count devices
    deviceCounts[data.deviceType]++;
    
    // Count browsers
    browserCounts[data.browser] = (browserCounts[data.browser] || 0) + 1;
    
    // Count OS
    osCounts[data.os] = (osCounts[data.os] || 0) + 1;
    
    // Count locations
    if (data.approximateLocation?.city) {
      const locationKey = `${data.approximateLocation.city}, ${data.approximateLocation.region || data.approximateLocation.country}`;
      locationCounts[locationKey] = (locationCounts[locationKey] || 0) + 1;
    }
  });
  
  return {
    totalSubmissions: submissions.length,
    deviceBreakdown: deviceCounts,
    browserBreakdown: browserCounts,
    osBreakdown: osCounts,
    locationBreakdown: locationCounts,
    mobilePercentage: submissions.length > 0 
      ? Math.round((deviceCounts.mobile / submissions.length) * 100) 
      : 0,
  };
}
