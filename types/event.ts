export type Event = {
  id: number;
  slug: string;
  title: string;
  paragraph: string;
  image: string;
  date: string;
  location: string;
  tags: string[];
  content?: string;
  registrationLink?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
};

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
