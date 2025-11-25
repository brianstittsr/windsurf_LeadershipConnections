import { Timestamp } from 'firebase/firestore';

export interface LeadershipProgram {
  name: string; // 'Leadership NC', 'Leadership Asheville', etc.
  graduationYear: number;
  cohort?: string;
  location?: string;
}

export interface BoardMembership {
  organization: string;
  role: string;
  current: boolean;
  startYear: number;
  endYear?: number;
}

export type MembershipStatus = 'active' | 'alumni' | 'lifetime';
export type ParticipationType = 'graduate' | 'participant' | 'mentor' | 'faculty';
export type ProfileVisibility = 'public' | 'members-only' | 'private';

export interface MemberProfile {
  id: string;
  userId: string;
  
  // Personal Information
  firstName: string;
  middleName?: string;
  lastName: string;
  preferredName?: string;
  email: string;
  phone?: string;
  city: string;
  state: string;
  zipCode: string;
  bio?: string;
  profilePhotoUrl?: string;
  linkedInUrl?: string;
  websiteUrl?: string;
  
  // Leadership Program Information
  programs: LeadershipProgram[];
  membershipStatus: MembershipStatus;
  participationType: ParticipationType;
  
  // Professional Information
  currentTitle?: string;
  currentOrganization?: string;
  industry?: string;
  yearsExperience?: number;
  previousOrganizations?: string[];
  certifications?: string[];
  boardMemberships?: BoardMembership[];
  awards?: string[];
  
  // Networking & Expertise
  expertise: string[];
  skills: string[];
  languages: string[];
  willingToMentor: boolean;
  seekingMentorship: boolean;
  openToNetworking: boolean;
  availableForSpeaking: boolean;
  volunteerInterests: string[];
  
  // Community Engagement
  communityInvolvement?: string;
  volunteerActivities?: string[];
  causes: string[];
  geographicInterests: string[];
  preferredContactMethods: string[];
  
  // Privacy Settings
  profileVisibility: ProfileVisibility;
  showEmail: boolean;
  showPhone: boolean;
  showEmployer: boolean;
  allowDirectMessages: boolean;
  includeInDirectory: boolean;
  
  // Metadata
  profileCompleteness: number;
  verified: boolean;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberProfileFormData extends Omit<MemberProfile, 'id' | 'userId' | 'profileCompleteness' | 'verified' | 'lastActive' | 'createdAt' | 'updatedAt'> {}

// Constants for dropdowns and selections
export const LEADERSHIP_PROGRAMS = [
  'Leadership North Carolina',
  'Leadership Asheville',
  'Leadership Greensboro',
  'Leadership Charlotte',
  'Leadership Winston-Salem',
  'Leadership Raleigh',
  'Leadership Durham',
  'Other NC Leadership Programs'
] as const;

export const INDUSTRIES = [
  'Healthcare',
  'Education',
  'Government/Public Service',
  'Nonprofit',
  'Business/Corporate',
  'Technology',
  'Finance',
  'Legal',
  'Manufacturing',
  'Real Estate',
  'Consulting',
  'Retail',
  'Hospitality',
  'Agriculture',
  'Energy',
  'Transportation',
  'Media/Communications',
  'Arts/Entertainment',
  'Other'
] as const;

export const EXPERTISE_AREAS = [
  'Leadership Development',
  'Community Engagement',
  'Strategic Planning',
  'Fundraising',
  'Marketing/Communications',
  'Human Resources',
  'Finance/Accounting',
  'Technology/Innovation',
  'Diversity & Inclusion',
  'Nonprofit Management',
  'Public Policy',
  'Education',
  'Healthcare',
  'Economic Development',
  'Environmental Sustainability',
  'Social Justice',
  'Youth Development',
  'Volunteer Management',
  'Board Governance',
  'Grant Writing'
] as const;

export const NC_REGIONS = [
  'Western NC',
  'Piedmont/Triad',
  'Triangle',
  'Charlotte Metro',
  'Eastern NC',
  'Coastal NC',
  'Statewide'
] as const;

export const CONTACT_METHODS = [
  'Email',
  'Phone',
  'LinkedIn',
  'In-Person',
  'Video Call'
] as const;

export const CAUSES = [
  'Education',
  'Healthcare',
  'Environment',
  'Social Justice',
  'Economic Development',
  'Arts & Culture',
  'Youth Development',
  'Senior Services',
  'Homelessness',
  'Food Security',
  'Mental Health',
  'Substance Abuse',
  'Veterans Services',
  'Animal Welfare',
  'Disaster Relief',
  'Community Development',
  'Civic Engagement'
] as const;

export type Industry = typeof INDUSTRIES[number];
export type ExpertiseArea = typeof EXPERTISE_AREAS[number];
export type NCRegion = typeof NC_REGIONS[number];
export type ContactMethod = typeof CONTACT_METHODS[number];
export type Cause = typeof CAUSES[number];
