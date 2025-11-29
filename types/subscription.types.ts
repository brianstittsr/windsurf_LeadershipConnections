import { Timestamp } from 'firebase/firestore';

export type SubscriptionPackage = 
  | 'ai-writing'
  | 'data-analytics'
  | 'grant-writing'
  | 'project-reporting'
  | 'everything';

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'pending';

export interface SubscriptionFeature {
  id: string;
  name: string;
  description: string;
  category: 'ai' | 'data' | 'grants' | 'reporting' | 'geocoding';
}

export interface SubscriptionPackageDetails {
  id: SubscriptionPackage;
  name: string;
  description: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly' | 'lifetime';
  features: string[]; // Feature IDs
  popular?: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  package: SubscriptionPackage;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  features: string[]; // Feature IDs
  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date;
  cancelReason?: string;
}

// Define all available features
export const SUBSCRIPTION_FEATURES: Record<string, SubscriptionFeature> = {
  'ai-text-enhancement': {
    id: 'ai-text-enhancement',
    name: 'AI Text Enhancement',
    description: 'Enhance event descriptions, grant proposals, and other text with AI',
    category: 'ai',
  },
  'ai-data-merge': {
    id: 'ai-data-merge',
    name: 'AI Data Merge',
    description: 'Intelligently merge and deduplicate datasets',
    category: 'ai',
  },
  'ai-reporting': {
    id: 'ai-reporting',
    name: 'AI Reporting',
    description: 'Generate automated reports from your data',
    category: 'ai',
  },
  'ai-data-analysis': {
    id: 'ai-data-analysis',
    name: 'AI Data Analysis',
    description: 'Advanced data analysis and insights',
    category: 'ai',
  },
  'geocoding': {
    id: 'geocoding',
    name: 'Geocoding Services',
    description: 'Convert addresses to coordinates for mapping',
    category: 'geocoding',
  },
  'data-export': {
    id: 'data-export',
    name: 'Data Export',
    description: 'Export datasets in multiple formats',
    category: 'data',
  },
  'data-archive': {
    id: 'data-archive',
    name: 'Data Archive',
    description: 'Archive and restore datasets',
    category: 'data',
  },
  'grant-templates': {
    id: 'grant-templates',
    name: 'Grant Templates',
    description: 'Access to professional grant writing templates',
    category: 'grants',
  },
  'grant-ai-writer': {
    id: 'grant-ai-writer',
    name: 'AI Grant Writer',
    description: 'AI-powered grant proposal writing assistance',
    category: 'grants',
  },
  'project-tracking': {
    id: 'project-tracking',
    name: 'Project Tracking',
    description: 'Track project milestones and deliverables',
    category: 'reporting',
  },
  'automated-reports': {
    id: 'automated-reports',
    name: 'Automated Reports',
    description: 'Generate automated project status reports',
    category: 'reporting',
  },
};

// Define subscription packages
export const SUBSCRIPTION_PACKAGES: SubscriptionPackageDetails[] = [
  {
    id: 'ai-writing',
    name: 'AI Writing Package',
    description: 'AI-powered text enhancement for events, grants, and communications',
    price: 29.99,
    billingPeriod: 'monthly',
    features: ['ai-text-enhancement', 'grant-templates'],
  },
  {
    id: 'data-analytics',
    name: 'Data Analytics Package',
    description: 'Advanced data management, analysis, and reporting tools',
    price: 49.99,
    billingPeriod: 'monthly',
    features: [
      'ai-data-merge',
      'ai-reporting',
      'ai-data-analysis',
      'data-export',
      'data-archive',
    ],
  },
  {
    id: 'grant-writing',
    name: 'Grant Writing Package',
    description: 'Complete grant writing toolkit with AI assistance',
    price: 39.99,
    billingPeriod: 'monthly',
    features: ['grant-templates', 'grant-ai-writer', 'ai-text-enhancement'],
  },
  {
    id: 'project-reporting',
    name: 'Project Reporting Package',
    description: 'Comprehensive project tracking and automated reporting',
    price: 34.99,
    billingPeriod: 'monthly',
    features: ['project-tracking', 'automated-reports', 'ai-reporting'],
  },
  {
    id: 'everything',
    name: 'Everything Package',
    description: 'All features included - best value!',
    price: 99.99,
    billingPeriod: 'monthly',
    features: Object.keys(SUBSCRIPTION_FEATURES),
    popular: true,
  },
];

// Helper function to check if user has a specific feature
export function userHasFeature(
  userSubscriptions: UserSubscription[],
  featureId: string
): boolean {
  return userSubscriptions.some(
    (sub) =>
      sub.status === 'active' &&
      sub.features.includes(featureId) &&
      (!sub.endDate || sub.endDate > new Date())
  );
}

// Helper function to get user's active subscriptions
export function getActiveSubscriptions(
  userSubscriptions: UserSubscription[]
): UserSubscription[] {
  return userSubscriptions.filter(
    (sub) =>
      sub.status === 'active' &&
      (!sub.endDate || sub.endDate > new Date())
  );
}
