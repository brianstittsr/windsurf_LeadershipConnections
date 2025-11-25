import { Timestamp } from 'firebase/firestore';

export type ConnectionStatus = 'pending' | 'accepted' | 'declined';
export type MentorshipStatus = 'active' | 'completed' | 'inactive';
export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Connection {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: ConnectionStatus;
  message?: string;
  createdAt: Date;
  respondedAt?: Date;
}

export interface Mentorship {
  id: string;
  mentorId: string;
  menteeId: string;
  status: MentorshipStatus;
  startDate: Date;
  endDate?: Date;
  focusAreas: string[];
  goals?: string;
  meetingFrequency?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  threadId: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  status: MessageStatus;
  attachments?: MessageAttachment[];
  createdAt: Date;
  readAt?: Date;
}

export interface MessageAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface MessageThread {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConnectionRequest {
  id: string;
  fromUser: {
    id: string;
    name: string;
    photoUrl?: string;
    title?: string;
    organization?: string;
  };
  toUserId: string;
  message?: string;
  status: ConnectionStatus;
  createdAt: Date;
}

export interface MentorshipApplication {
  id: string;
  applicantId: string;
  mentorId?: string;
  menteeId?: string;
  type: 'mentor' | 'mentee';
  focusAreas: string[];
  goals: string;
  availability: string;
  experience?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  reviewedAt?: Date;
}
