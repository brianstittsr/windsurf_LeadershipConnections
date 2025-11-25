import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
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
 * Upload profile photo to Firebase Storage
 */
export async function uploadProfilePhoto(
  userId: string,
  file: File
): Promise<string> {
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile-${userId}-${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `member-profiles/${userId}/${fileName}`);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    throw error;
  }
}

/**
 * Delete profile photo from Firebase Storage
 */
export async function deleteProfilePhoto(photoUrl: string): Promise<void> {
  try {
    const storageRef = ref(storage, photoUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting profile photo:', error);
    // Don't throw error if file doesn't exist
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
