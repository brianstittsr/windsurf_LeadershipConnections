import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

import { UserRole } from '@/types/roles';
import { MemberProfile } from '@/types/member-profile.types';
import { Connection, Mentorship, Message, MessageThread } from '@/types/networking.types';
import { LCForm, Dataset } from '@/types/lc-form.types';

// Define the schema structure for our Firestore collections
export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role?: UserRole;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  programInterests?: {
    letsMove?: boolean;
    arts?: boolean;
    fitnessAndArtsBoth?: boolean;
    ppivotHighTech?: boolean;
    ppivotConstruction?: boolean;
    techAndTradesBoth?: boolean;
    ncAAndT?: boolean;
    ncState?: boolean;
    shaw?: boolean;
    duke?: boolean;
    elon?: boolean;
    uncChapelHill?: boolean;
    otherUniversity?: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AlumniComment {
  id: string;
  name: string;
  title: string;
  comment: string;
  image: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogEntry {
  id: string | number;  // Can be numeric (user-defined) or string (Firestore doc ID)
  firestoreId?: string;  // Firestore document ID
  slug: string;
  title: string;
  paragraph: string;
  content: string;
  image: string;
  author: {
    name: string;
    image: string;
    designation: string;
  };
  tags: string[];
  publishDate: string;
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ServiceEntry {
  id: string;
  slug: string;
  title: string;
  paragraph: string;
  content: string;
  image: string;
  author: {
    name: string;
    image: string;
    designation: string;
  };
  tags: string[];
  publishDate: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgramEntry {
  id: string;
  slug: string;
  title: string;
  paragraph: string;
  content: string;
  image: string;
  author: {
    name: string;
    image: string;
    designation: string;
  };
  tags: string[];
  publishDate: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUser {
  uid: string;
  email: string;
  role: 'admin' | 'editor';
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Initialize default collections and documents
export async function initializeFirestoreSchema() {
  try {
    // Initialize default alumni comments
    const defaultAlumniComments: Omit<AlumniComment, 'id'>[] = [
      {
        name: "Sarah Johnson",
        title: "Program Graduate 2020",
        comment: "The Leadership C.O.N.N.E.C.T.I.O.N.S. Program transformed my life. The mentorship and opportunities I received helped me develop confidence and leadership skills that I use every day in my career.",
        image: "/images/testimonials/author-01.png",
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Marcus Williams",
        title: "Program Graduate 2019",
        comment: "Through this program, I learned the importance of giving back to my community. The 3-tier mentoring system provided me with guidance at every level of my development.",
        image: "/images/testimonials/author-02.png",
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Ashley Davis",
        title: "Program Graduate 2021",
        comment: "The college preparation and summer experiences opened doors I never thought possible. I'm now pursuing my degree with confidence and a clear vision for my future.",
        image: "/images/testimonials/author-03.png",
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Create alumni comments collection
    for (let i = 0; i < defaultAlumniComments.length; i++) {
      const commentRef = doc(collection(db, 'alumniComments'));
      await setDoc(commentRef, {
        ...defaultAlumniComments[i],
        id: commentRef.id
      });
    }

    // Initialize site settings
    const siteSettingsRef = doc(db, 'settings', 'site');
    const siteSettingsDoc = await getDoc(siteSettingsRef);
    
    if (!siteSettingsDoc.exists()) {
      await setDoc(siteSettingsRef, {
        siteName: 'Leadership C.O.N.N.E.C.T.I.O.N.S.',
        tagline: 'Empowering Tomorrow\'s Leaders',
        contactEmail: 'info@ncleadconnect.org',
        socialMedia: {
          facebook: '',
          twitter: '',
          instagram: '',
          linkedin: ''
        },
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    console.log('Firestore schema initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('Error initializing Firestore schema:', error);
    return { success: false, error };
  }
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  image?: string;
  category: 'workshop' | 'class' | 'event' | 'meeting' | 'other';
  maxAttendees?: number;
  currentAttendees: number;
  registrationRequired: boolean;
  registrationFormId?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomForm {
  id: string;
  title: string;
  description: string;
  slug: string;
  fields: any[];
  template?: string;
  qrCode?: string;
  publicUrl: string;
  published: boolean;
  allowMultipleSubmissions: boolean;
  requiresAuth: boolean;
  createdAt: Date;
  updatedAt: Date;
  submissionCount: number;
}

export interface FormSubmission {
  id: string;
  formId: string;
  formTitle: string;
  data: Record<string, any>;
  submittedBy?: string;
  submittedAt: Date;
  ipAddress?: string;
  trackingData?: {
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
    approximateLocation?: {
      city?: string;
      region?: string;
      country?: string;
      latitude?: number;
      longitude?: number;
    };
  };
}

export interface BrainstormingMethod {
  id: string;
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
  keyPoints: string[];
  bestFor: string;
  steps: string[];
  tips: string[];
  examples: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  icon?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  status: 'active' | 'archived' | 'completed';
  // Associated resources
  formIds: string[];
  datasetIds: string[];
  eventIds: string[];
  // Metadata
  metadata: {
    totalForms: number;
    totalDatasets: number;
    totalSubmissions: number;
    lastActivity?: Date;
  };
}

// Export types for Leadership Connections
export type { MemberProfile, Connection, Mentorship, Message, MessageThread, LCForm, Dataset };

// Collection references for easy access
export const collections = {
  users: 'users',
  alumniComments: 'alumniComments',
  blogEntries: 'blogEntries',
  serviceEntries: 'serviceEntries',
  programEntries: 'programEntries',
  adminUsers: 'adminUsers',
  settings: 'settings',
  calendarEvents: 'calendarEvents',
  customForms: 'customForms',
  formSubmissions: 'formSubmissions',
  // Leadership Connections collections
  memberProfiles: 'memberProfiles',
  connections: 'connections',
  mentorships: 'mentorships',
  messages: 'messages',
  messageThreads: 'messageThreads',
  lcForms: 'lcForms',
  lcDatasets: 'lcDatasets',
  lcFormSubmissions: 'lcFormSubmissions',
  strategicPlanningMethods: 'strategicPlanningMethods',
  projects: 'projects'
};
