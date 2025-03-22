'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import SplashScreen from '../SplashScreen';

interface SplashScreenControllerProps {
  children: React.ReactNode;
}

const SplashScreenController: React.FC<SplashScreenControllerProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showingSplash, setShowingSplash] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    // Only run this effect on the client side
    if (typeof window !== 'undefined') {
      const hasSeenSplash = localStorage.getItem('hasSeenSplash');
      
      // If we're not on the splash page and the user hasn't seen the splash screen yet
      if (pathname !== '/splash' && !hasSeenSplash) {
        setShowingSplash(true);
        // Set a flag to prevent redirect loops
        localStorage.setItem('redirecting', 'true');
        // Redirect to splash page
        router.push('/splash');
      } else {
        setInitialized(true);
      }

      // Clean up the redirecting flag
      return () => {
        localStorage.removeItem('redirecting');
      };
    }
  }, [pathname, router]);

  // Handle completion of splash screen
  const handleSplashComplete = () => {
    localStorage.setItem('hasSeenSplash', 'true');
    setShowingSplash(false);
    router.push('/');
  };

  // If we're showing the splash screen or we're on the splash page, render the splash screen
  if (showingSplash || pathname === '/splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // If we're initialized, render the children
  if (initialized) {
    return <>{children}</>;
  }

  // Return null during initialization to prevent flash of content
  return null;
};

export default SplashScreenController;
