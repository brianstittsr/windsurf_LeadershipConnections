import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Utility function to add a sample calendar event
 * Can be called from admin panel or run directly
 */

export async function addSampleCalendarEvent() {
  try {
    // Create a sample event for next month
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(15); // 15th of next month
    nextMonth.setHours(18, 0, 0, 0); // 6:00 PM

    const endTime = new Date(nextMonth);
    endTime.setHours(20, 0, 0, 0); // 8:00 PM

    const sampleEvent = {
      title: 'Leadership Development Workshop',
      description: `Join us for an inspiring evening of leadership development and community building. This interactive workshop will cover:

• Effective communication strategies for emerging leaders
• Building and maintaining professional networks
• Goal setting and achievement planning
• Community engagement and social responsibility

This event is perfect for youth interested in developing their leadership skills and connecting with like-minded individuals. Light refreshments will be provided.

All participants will receive a certificate of completion and access to our exclusive leadership resources library.`,
      startDate: Timestamp.fromDate(nextMonth),
      endDate: Timestamp.fromDate(endTime),
      location: '123 Leadership Lane, Durham, NC 27701',
      image: '',
      category: 'workshop',
      maxAttendees: 50,
      currentAttendees: 12,
      registrationRequired: true,
      published: true,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    };

    const docRef = await addDoc(collection(db, 'calendarEvents'), sampleEvent);
    
    return { 
      success: true, 
      eventId: docRef.id,
      message: 'Sample event added successfully!'
    };
  } catch (error) {
    console.error('Error adding sample event:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function addMultipleSampleEvents() {
  try {
    const events = [];
    
    // Event 1: Next month workshop
    const event1Date = new Date();
    event1Date.setMonth(event1Date.getMonth() + 1);
    event1Date.setDate(15);
    event1Date.setHours(18, 0, 0, 0);
    
    const event1End = new Date(event1Date);
    event1End.setHours(20, 0, 0, 0);

    events.push({
      title: 'Leadership Development Workshop',
      description: 'Join us for an inspiring evening of leadership development and community building. Learn effective communication strategies, network building, and goal setting.',
      startDate: Timestamp.fromDate(event1Date),
      endDate: Timestamp.fromDate(event1End),
      location: '123 Leadership Lane, Durham, NC 27701',
      category: 'workshop',
      maxAttendees: 50,
      currentAttendees: 12,
      registrationRequired: true,
      published: true,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    });

    // Event 2: Community Meeting
    const event2Date = new Date();
    event2Date.setMonth(event2Date.getMonth() + 1);
    event2Date.setDate(22);
    event2Date.setHours(14, 0, 0, 0);
    
    const event2End = new Date(event2Date);
    event2End.setHours(16, 0, 0, 0);

    events.push({
      title: 'Community Engagement Meeting',
      description: 'Monthly community meeting to discuss upcoming programs, share success stories, and plan future initiatives. All community members are welcome!',
      startDate: Timestamp.fromDate(event2Date),
      endDate: Timestamp.fromDate(event2End),
      location: 'Community Center, 456 Main Street, Durham, NC 27701',
      category: 'meeting',
      maxAttendees: 100,
      currentAttendees: 45,
      registrationRequired: false,
      published: true,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    });

    // Event 3: Youth Mentorship Class
    const event3Date = new Date();
    event3Date.setMonth(event3Date.getMonth() + 2);
    event3Date.setDate(5);
    event3Date.setHours(10, 0, 0, 0);
    
    const event3End = new Date(event3Date);
    event3End.setHours(12, 0, 0, 0);

    events.push({
      title: 'Youth Mentorship Kickoff',
      description: 'Start your mentorship journey! This kickoff event will pair mentors with mentees and outline the program structure for the upcoming semester.',
      startDate: Timestamp.fromDate(event3Date),
      endDate: Timestamp.fromDate(event3End),
      location: 'Leadership C.O.N.N.E.C.T.I.O.N.S. Center, Durham, NC',
      category: 'class',
      maxAttendees: 30,
      currentAttendees: 8,
      registrationRequired: true,
      published: true,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    });

    // Add all events to Firestore
    const results = [];
    for (const event of events) {
      const docRef = await addDoc(collection(db, 'calendarEvents'), event);
      results.push({ id: docRef.id, title: event.title });
    }

    return {
      success: true,
      message: `${results.length} sample events added successfully!`,
      events: results
    };
  } catch (error) {
    console.error('Error adding sample events:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
