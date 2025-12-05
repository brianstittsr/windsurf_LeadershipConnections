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
  | 'youth-360-liability'
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
  'youth-360-liability': {
    name: 'Youth 360 Event - Liability Release & Permission Slip',
    description: "The Women's Foundation of North Carolina and Leadership CONNECTIONS' Youth 360 Event liability release, medical authorization, and permission slip.",
    fields: [
      // Section 1: General Release Acknowledgment
      { label: 'I acknowledge and accept the General Release of Liability terms', type: 'checkbox', required: true, order: 1,
        options: ['I voluntarily release Leadership Connections, its staff, volunteers, and partner agencies from liability for injuries, accidents, or damage during the event, except in cases of negligence or willful misconduct'] },
      
      // Section 2: Medical Authorization
      { label: 'Medical Authorization', type: 'checkbox', required: true, order: 2,
        options: ['I authorize Leadership Connections to secure emergency medical treatment and transportation if necessary. I acknowledge responsibility for any resulting medical costs.'] },
      
      // Section 3: Photo & Media Release
      { label: 'Photo & Media Release Permission', type: 'radio', required: true, order: 3,
        options: ['I DO grant permission for photos/videos to be used for program documentation or promotional purposes', 'I DO NOT grant permission for photos/videos to be used'] },
      
      // Section 4: Participant Information
      { label: 'Participant Full Name', type: 'text', required: true, order: 4 },
      { label: 'Date of Birth (if minor)', type: 'date', required: false, order: 5 },
      { label: 'Phone Number', type: 'phone', required: true, order: 6 },
      { label: 'Emergency Contact Name', type: 'text', required: true, order: 7 },
      { label: 'Emergency Contact Phone', type: 'phone', required: true, order: 8 },
      { label: 'Transportation Needed?', type: 'radio', required: true, order: 9,
        options: ['YES', 'NO'] },
      
      // Section 5A: Adult Participants
      { label: 'Participant Type', type: 'radio', required: true, order: 10,
        options: ['Adult (18+) - signing on my own behalf', 'Minor - parent/guardian signing below'] },
      
      // Section 5B: For Minors - Parent/Guardian Info
      { label: 'Parent/Guardian Name (required for minors)', type: 'text', required: false, order: 11 },
      
      // Signature acknowledgment
      { label: 'Digital Signature Acknowledgment', type: 'checkbox', required: true, order: 12,
        options: ['By checking this box, I certify that I have read and agree to all terms above. This serves as my electronic signature.'] },
      
      { label: 'Printed Name (Person Signing)', type: 'text', required: true, order: 13 },
      { label: 'Date of Signature', type: 'date', required: true, order: 14 }
    ]
  },
  'custom': {
    name: 'Custom Form',
    description: 'Start with a blank form and add your own fields',
    fields: []
  }
};
