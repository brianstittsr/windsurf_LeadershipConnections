import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { MemberProfile, MemberProfileFormData } from '@/types/member-profile.types';
import { collections } from './firestore-schema';

/**
 * Calculate profile completeness percentage
 */
export function calculateProfileCompleteness(profile: Partial<MemberProfile>): number {
  const fields = [
    // Required fields (40 points)
    profile.firstName,
    profile.lastName,
    profile.email,
    profile.city,
    profile.state,
    profile.zipCode,
    profile.programs && profile.programs.length > 0,
    profile.membershipStatus,
    
    // Important fields (30 points)
    profile.profilePhotoUrl,
    profile.bio,
    profile.currentTitle,
    profile.currentOrganization,
    profile.industry,
    profile.expertise && profile.expertise.length > 0,
    
    // Optional fields (30 points)
    profile.phone,
    profile.linkedInUrl,
    profile.skills && profile.skills.length > 0,
    profile.boardMemberships && profile.boardMemberships.length > 0,
    profile.causes && profile.causes.length > 0,
    profile.geographicInterests && profile.geographicInterests.length > 0,
    profile.preferredContactMethods && profile.preferredContactMethods.length > 0
  ];
  
  const completedFields = fields.filter(Boolean).length;
  return Math.round((completedFields / fields.length) * 100);
}

/**
 * Get member profile by user ID
 */
export async function getMemberProfile(userId: string): Promise<MemberProfile | null> {
  try {
    const profileRef = doc(db, collections.memberProfiles, userId);
    const profileDoc = await getDoc(profileRef);
    
    if (!profileDoc.exists()) {
      return null;
    }
    
    const data = profileDoc.data();
    return {
      id: profileDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      lastActive: data.lastActive?.toDate() || new Date(),
    } as MemberProfile;
  } catch (error) {
    console.error('Error fetching member profile:', error);
    throw error;
  }
}

/**
 * Create or update member profile
 */
export async function saveMemberProfile(
  userId: string,
  profileData: MemberProfileFormData
): Promise<void> {
  try {
    const profileRef = doc(db, collections.memberProfiles, userId);
    const profileDoc = await getDoc(profileRef);
    
    const completeness = calculateProfileCompleteness(profileData);
    const now = new Date();
    
    const dataToSave = {
      ...profileData,
      userId,
      profileCompleteness: completeness,
      lastActive: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    };
    
    if (profileDoc.exists()) {
      // Update existing profile
      await updateDoc(profileRef, dataToSave);
    } else {
      // Create new profile
      await setDoc(profileRef, {
        ...dataToSave,
        verified: false,
        createdAt: Timestamp.fromDate(now),
      });
    }
  } catch (error) {
    console.error('Error saving member profile:', error);
    throw error;
  }
}

/**
 * Convert image file to WebP base64 format for optimal performance
 */
export async function uploadProfilePhoto(
  userId: string,
  file: File
): Promise<string> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('Image must be less than 5MB');
    }
    
    // Convert to WebP base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        
        // Load and convert image to WebP
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set max dimensions
          const maxWidth = 800;
          const maxHeight = 800;
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw image
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert to WebP format with 85% quality for optimal size/quality balance
          // WebP provides 25-35% better compression than JPEG
          const webpBase64 = canvas.toDataURL('image/webp', 0.85);
          
          // Fallback to JPEG if WebP is not supported (rare in modern browsers)
          if (webpBase64.startsWith('data:image/webp')) {
            resolve(webpBase64);
          } else {
            console.warn('WebP not supported, falling back to JPEG');
            const jpegBase64 = canvas.toDataURL('image/jpeg', 0.8);
            resolve(jpegBase64);
          }
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
        
        img.src = base64String;
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Error converting profile photo to WebP:', error);
    throw error;
  }
}

/**
 * Delete profile photo (base64 stored in Firestore)
 * Since we're using base64, we just need to update the profile to remove the photo URL
 */
export async function deleteProfilePhoto(userId: string): Promise<void> {
  try {
    const profileRef = doc(db, collections.memberProfiles, userId);
    await updateDoc(profileRef, {
      profilePhotoUrl: null,
      updatedAt: Timestamp.fromDate(new Date())
    });
  } catch (error) {
    console.error('Error deleting profile photo:', error);
    throw error;
  }
}

/**
 * Search member profiles
 */
export async function searchMemberProfiles(
  searchTerm: string,
  filters?: {
    programs?: string[];
    industries?: string[];
    expertise?: string[];
    regions?: string[];
    willingToMentor?: boolean;
    availableForSpeaking?: boolean;
  }
): Promise<MemberProfile[]> {
  try {
    let q = query(collection(db, collections.memberProfiles));
    
    // Add filters
    if (filters?.programs && filters.programs.length > 0) {
      q = query(q, where('programs', 'array-contains-any', filters.programs));
    }
    
    if (filters?.willingToMentor !== undefined) {
      q = query(q, where('willingToMentor', '==', filters.willingToMentor));
    }
    
    if (filters?.availableForSpeaking !== undefined) {
      q = query(q, where('availableForSpeaking', '==', filters.availableForSpeaking));
    }
    
    // Only show profiles that are included in directory
    q = query(q, where('includeInDirectory', '==', true));
    
    const querySnapshot = await getDocs(q);
    const profiles = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        lastActive: data.lastActive?.toDate() || new Date(),
      } as MemberProfile;
    });
    
    // Client-side filtering for text search and other criteria
    let filteredProfiles = profiles;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredProfiles = profiles.filter(profile => 
        profile.firstName?.toLowerCase().includes(term) ||
        profile.lastName?.toLowerCase().includes(term) ||
        profile.currentOrganization?.toLowerCase().includes(term) ||
        profile.currentTitle?.toLowerCase().includes(term) ||
        profile.expertise?.some(e => e.toLowerCase().includes(term))
      );
    }
    
    if (filters?.industries && filters.industries.length > 0) {
      filteredProfiles = filteredProfiles.filter(profile =>
        profile.industry && filters.industries!.includes(profile.industry)
      );
    }
    
    if (filters?.expertise && filters.expertise.length > 0) {
      filteredProfiles = filteredProfiles.filter(profile =>
        profile.expertise?.some(e => filters.expertise!.includes(e))
      );
    }
    
    if (filters?.regions && filters.regions.length > 0) {
      filteredProfiles = filteredProfiles.filter(profile =>
        profile.geographicInterests?.some(r => filters.regions!.includes(r))
      );
    }
    
    return filteredProfiles;
  } catch (error) {
    console.error('Error searching member profiles:', error);
    throw error;
  }
}

/**
 * Get member profiles by IDs
 */
export async function getMemberProfilesByIds(userIds: string[]): Promise<MemberProfile[]> {
  try {
    const profiles: MemberProfile[] = [];
    
    for (const userId of userIds) {
      const profile = await getMemberProfile(userId);
      if (profile) {
        profiles.push(profile);
      }
    }
    
    return profiles;
  } catch (error) {
    console.error('Error fetching member profiles by IDs:', error);
    throw error;
  }
}

/**
 * Update last active timestamp
 */
export async function updateLastActive(userId: string): Promise<void> {
  try {
    const profileRef = doc(db, collections.memberProfiles, userId);
    await updateDoc(profileRef, {
      lastActive: Timestamp.fromDate(new Date())
    });
  } catch (error) {
    console.error('Error updating last active:', error);
    // Don't throw error, this is not critical
  }
}
