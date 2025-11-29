import { Timestamp } from 'firebase/firestore';

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'volunteer';
export type JobLocation = 'on-site' | 'remote' | 'hybrid';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'executive';

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  
  // Job Details
  jobType: JobType;
  location: JobLocation;
  city?: string;
  state?: string;
  experienceLevel: ExperienceLevel;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  
  // Categories & Skills
  industry?: string;
  category: string;
  skills: string[];
  
  // Application
  applicationUrl?: string;
  applicationEmail?: string;
  applicationInstructions?: string;
  
  // Metadata
  postedBy: string; // userId
  postedByName: string;
  postedByEmail: string;
  status: 'active' | 'closed' | 'draft';
  featured: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Stats
  viewCount: number;
  applicationCount: number;
  referralCount: number;
}

export interface JobReferral {
  id: string;
  jobId: string;
  jobTitle: string;
  referredBy: string; // userId who made the referral
  referredByName: string;
  referredTo: string; // userId being referred
  referredToName: string;
  referredToEmail: string;
  message: string;
  status: 'pending' | 'viewed' | 'applied' | 'declined';
  createdAt: Date;
  viewedAt?: Date;
}

export const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: 'full-time', label: 'Full-Time' },
  { value: 'part-time', label: 'Part-Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'volunteer', label: 'Volunteer' },
];

export const JOB_LOCATIONS: { value: JobLocation; label: string }[] = [
  { value: 'on-site', label: 'On-Site' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
];

export const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior Level' },
  { value: 'executive', label: 'Executive' },
];

export const JOB_CATEGORIES = [
  'Executive Leadership',
  'Nonprofit Management',
  'Program Management',
  'Development & Fundraising',
  'Marketing & Communications',
  'Human Resources',
  'Finance & Accounting',
  'Operations',
  'Technology',
  'Education',
  'Healthcare',
  'Government',
  'Consulting',
  'Other',
];
