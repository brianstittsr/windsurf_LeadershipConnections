'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Breadcrumb from '@/components/Common/Breadcrumb';
import Link from 'next/link';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  category: string;
  published: boolean;
}

interface EventsByMonth {
  [key: string]: CalendarEvent[];
}

const LCEventCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const now = new Date();
        const eventsRef = collection(db, 'calendarEvents');
        const q = query(
          eventsRef,
          where('published', '==', true),
          where('startDate', '>=', Timestamp.fromDate(now)),
          orderBy('startDate', 'asc')
        );
        
        const querySnapshot = await getDocs(q);
        const eventsData: CalendarEvent[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          eventsData.push({
            id: doc.id,
            title: data.title,
            description: data.description,
            startDate: data.startDate.toDate(),
            endDate: data.endDate.toDate(),
            location: data.location,
            category: data.category || 'event',
            published: data.published,
          });
        });
        
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  // Group events by month
  const groupEventsByMonth = (): EventsByMonth => {
    const grouped: EventsByMonth = {};
    
    events.forEach((event) => {
      const monthYear = event.startDate.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
      
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(event);
    });
    
    return grouped;
  };

  const eventsByMonth = groupEventsByMonth();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getMonthAbbreviation = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  };

  const getDay = (date: Date) => {
    return date.getDate();
  };

  const getCategoryDisplay = (category: string) => {
    const categories: { [key: string]: string } = {
      workshop: 'Workshop',
      class: 'Class',
      event: 'Event',
      meeting: 'Meeting',
      other: 'Other'
    };
    return categories[category] || 'Event';
  };

  return (
    <>
      <Breadcrumb
        pageName="LC Event Calendar"
        description="Stay connected with upcoming Leadership C.O.N.N.E.C.T.I.O.N.S. events and activities"
      />

      <section className="pb-[120px] pt-[120px] bg-white dark:bg-gray-900">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-12 text-center text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-5xl">
              Upcoming Events
            </h1>

            {loading ? (
              <div className="text-center">
                <p className="text-body-color dark:text-gray-300">Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center">
                <p className="text-body-color dark:text-gray-300">No upcoming events scheduled at this time.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {Object.entries(eventsByMonth).map(([monthYear, monthEvents]) => (
                  <div key={monthYear}>
                    <h2 className="mb-6 text-2xl font-bold text-primary dark:text-primary-light">
                      {monthYear}
                    </h2>
                    
                    <div className="space-y-4">
                      {monthEvents.map((event) => (
                        <div
                          key={event.id}
                          className="wow fadeInUp group relative overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-2xl dark:bg-gray-800"
                          data-wow-delay=".1s"
                        >
                          <div className="flex items-stretch">
                            {/* Date Badge */}
                            <div className="flex w-24 flex-col items-center justify-center bg-gradient-to-br from-primary to-purple-600 p-4 text-white">
                              <span className="text-sm font-semibold">
                                {getMonthAbbreviation(event.startDate)}
                              </span>
                              <span className="text-4xl font-bold leading-none">
                                {getDay(event.startDate)}
                              </span>
                            </div>

                            {/* Event Details */}
                            <div className="flex-1 p-6">
                              <div className="mb-2 flex items-start justify-between">
                                <div className="flex-1">
                                  <span className="mb-2 inline-block rounded bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase">
                                    {getCategoryDisplay(event.category)}
                                  </span>
                                  <h3 className="mb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
                                    {event.title}
                                  </h3>
                                </div>
                              </div>

                              <p className="mb-4 text-base text-body-color dark:text-gray-300">
                                {event.description}
                              </p>

                              <div className="flex flex-wrap gap-4 text-sm text-body-color dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                  <svg
                                    className="h-5 w-5 text-primary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <span>{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <svg
                                    className="h-5 w-5 text-primary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                  </svg>
                                  <span>{event.location}</span>
                                </div>
                              </div>
                            </div>

                            {/* Action Button */}
                            <div className="flex items-center pr-6">
                              <Link
                                href={`/lc-event-calendar/${event.id}`}
                                className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary/90"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default LCEventCalendar;
