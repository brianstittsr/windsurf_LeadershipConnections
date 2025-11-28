import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Script to add a sample calendar event to Firestore
 * Run this with: npx ts-node scripts/add-sample-event.ts
 */

async function addSampleEvent() {
  try {
    // Create a sample event for next month
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
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
      image: '/images/events/leadership-workshop.jpg',
      category: 'workshop' as const,
      maxAttendees: 50,
      currentAttendees: 12,
      registrationRequired: true,
      published: true,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    };

    const docRef = await addDoc(collection(db, 'calendarEvents'), sampleEvent);
    
    console.log('✅ Sample event added successfully!');
    console.log('Event ID:', docRef.id);
    console.log('Event Title:', sampleEvent.title);
    console.log('Event Date:', nextMonth.toLocaleDateString());
    console.log('Event Time:', nextMonth.toLocaleTimeString());
    
    return { success: true, eventId: docRef.id };
  } catch (error) {
    console.error('❌ Error adding sample event:', error);
    return { success: false, error };
  }
}

// Run the function
addSampleEvent()
  .then((result) => {
    if (result.success) {
      console.log('\n🎉 Sample event has been added to your calendar!');
      console.log('Visit /lc-event-calendar to see it.');
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
