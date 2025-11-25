export type FormFieldType = 
  | 'text' 
  | 'email' 
  | 'phone' 
  | 'textarea' 
  | 'select' 
  | 'checkbox' 
  | 'radio' 
  | 'date' 
  | 'number'
  | 'file';

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  placeholder?: string;
  options?: string[]; // For select, radio, checkbox
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  order: number;
}

export interface CustomForm {
  id: string;
  title: string;
  description: string;
  slug: string;
  fields: FormField[];
  template?: FormTemplate;
  qrCode?: string; // Base64 encoded QR code
  publicUrl: string;
  published: boolean;
  allowMultipleSubmissions: boolean;
  requiresAuth: boolean;
  createdAt: Date;
  updatedAt: Date;
  submissionCount: number;
}

export type FormTemplate = 
  | 'event-registration'
  | 'attendance-tracking'
  | 'donation-tracking'
  | 'pre-event-survey'
  | 'post-event-survey'
  | 'custom';

export interface FormSubmission {
  id: string;
  formId: string;
  formTitle: string;
  data: Record<string, any>;
  submittedBy?: string; // User ID if authenticated
  submittedAt: Date;
  ipAddress?: string;
}

export interface FormTemplateConfig {
  name: string;
  description: string;
  fields: Omit<FormField, 'id'>[];
}

export const formTemplates: Record<FormTemplate, FormTemplateConfig> = {
  'event-registration': {
    name: 'Event Registration',
    description: 'Standard event registration form with attendee information',
    fields: [
      { label: 'Full Name', type: 'text', required: true, order: 1 },
      { label: 'Email Address', type: 'email', required: true, order: 2 },
      { label: 'Phone Number', type: 'phone', required: true, order: 3 },
      { label: 'Number of Attendees', type: 'number', required: true, order: 4, validation: { min: 1, max: 10 } },
      { label: 'Dietary Restrictions', type: 'textarea', required: false, order: 5 },
      { label: 'How did you hear about this event?', type: 'select', required: false, order: 6, 
        options: ['Social Media', 'Email', 'Friend/Family', 'Website', 'Other'] }
    ]
  },
  'attendance-tracking': {
    name: 'Attendance Tracking',
    description: 'Quick check-in form for tracking event attendance',
    fields: [
      { label: 'Full Name', type: 'text', required: true, order: 1 },
      { label: 'Email Address', type: 'email', required: true, order: 2 },
      { label: 'Check-in Time', type: 'date', required: true, order: 3 },
      { label: 'Program/Event', type: 'select', required: true, order: 4,
        options: ['Red Carpet Kids', 'STEEM', 'Trades Program', 'Other'] }
    ]
  },
  'donation-tracking': {
    name: 'Donation Tracking',
    description: 'Form for tracking donations and donor information',
    fields: [
      { label: 'Donor Name', type: 'text', required: true, order: 1 },
      { label: 'Email Address', type: 'email', required: true, order: 2 },
      { label: 'Phone Number', type: 'phone', required: false, order: 3 },
      { label: 'Donation Amount', type: 'number', required: true, order: 4, validation: { min: 1 } },
      { label: 'Donation Type', type: 'select', required: true, order: 5,
        options: ['One-time', 'Monthly', 'Annual'] },
      { label: 'Program to Support', type: 'select', required: false, order: 6,
        options: ['General Fund', 'Red Carpet Kids', 'STEEM', 'Trades Program', 'Scholarships'] },
      { label: 'Comments', type: 'textarea', required: false, order: 7 }
    ]
  },
  'pre-event-survey': {
    name: 'Pre-Event Survey',
    description: 'Survey to gather attendee expectations and information before an event',
    fields: [
      { label: 'Full Name', type: 'text', required: true, order: 1 },
      { label: 'Email Address', type: 'email', required: true, order: 2 },
      { label: 'What are you most excited about?', type: 'textarea', required: true, order: 3 },
      { label: 'What do you hope to learn?', type: 'textarea', required: true, order: 4 },
      { label: 'Do you have any specific questions?', type: 'textarea', required: false, order: 5 },
      { label: 'Experience Level', type: 'select', required: true, order: 6,
        options: ['Beginner', 'Intermediate', 'Advanced'] }
    ]
  },
  'post-event-survey': {
    name: 'Post-Event Survey',
    description: 'Survey to gather feedback after an event',
    fields: [
      { label: 'Full Name', type: 'text', required: false, order: 1 },
      { label: 'Email Address', type: 'email', required: false, order: 2 },
      { label: 'Overall Rating', type: 'select', required: true, order: 3,
        options: ['Excellent', 'Good', 'Fair', 'Poor'] },
      { label: 'What did you like most?', type: 'textarea', required: true, order: 4 },
      { label: 'What could be improved?', type: 'textarea', required: true, order: 5 },
      { label: 'Would you attend future events?', type: 'radio', required: true, order: 6,
        options: ['Yes', 'No', 'Maybe'] },
      { label: 'Additional Comments', type: 'textarea', required: false, order: 7 }
    ]
  },
  'custom': {
    name: 'Custom Form',
    description: 'Start with a blank form and add your own fields',
    fields: []
  }
};
