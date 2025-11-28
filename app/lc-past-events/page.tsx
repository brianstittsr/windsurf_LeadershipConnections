'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import SingleEvent from "@/components/Events/SingleEvent";
import eventsData from "@/components/Events/eventsData";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from 'next/link';
import { Event } from "@/types/event";

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

const LCPastEventsPage = () => {
  const [pastCalendarEvents, setPastCalendarEvents] = useState<CalendarEvent[]>([]);
  const [firestorePastEvents, setFirestorePastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPastEvents = async () => {
      try {
        // Fetch calendar events
        const now = new Date();
        const calendarEventsRef = collection(db, 'calendarEvents');
        const calendarQuery = query(
          calendarEventsRef,
          where('published', '==', true),
          where('endDate', '<', Timestamp.fromDate(now)),
          orderBy('endDate', 'desc')
        );
        
        const calendarSnapshot = await getDocs(calendarQuery);
        const calendarEventsData: CalendarEvent[] = [];
        
        calendarSnapshot.forEach((doc) => {
          const data = doc.data();
          calendarEventsData.push({
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
        
        setPastCalendarEvents(calendarEventsData);

        // Fetch past events from lcPastEvents collection
        const pastEventsRef = collection(db, 'lcPastEvents');
        const pastEventsQuery = query(
          pastEventsRef,
          where('published', '==', true)
        );
        
        const pastEventsSnapshot = await getDocs(pastEventsQuery);
        const pastEventsData: Event[] = [];
        
        pastEventsSnapshot.forEach((doc) => {
          const data = doc.data();
          pastEventsData.push({
            id: data.id || 0,
            slug: data.slug || doc.id,
            title: data.title || '',
            paragraph: data.paragraph || '',
            image: data.image || '/images/events/default.jpg',
            date: data.date || '',
            location: data.location || '',
            tags: data.tags || [],
            content: data.content
          });
        });
        
        setFirestorePastEvents(pastEventsData);
      } catch (error) {
        console.error('Error fetching past events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPastEvents();
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategoryDisplay = (category: string) => {
    const categories: { [key: string]: string } = {
      workshop: 'Workshop',
      class: 'Class',
      event: 'Event',
      meeting: 'Meeting',
      other: 'Other',
    };
    return categories[category] || 'Event';
  };

  return (
    <>
      <Breadcrumb
        pageName="LC Past Events"
        description="Explore past events and activities from Leadership C.O.N.N.E.C.T.I.O.N.S. - celebrating our community impact and memorable moments."
      />

      <section className="py-16 md:py-20 lg:py-28 bg-white">
        <div className="container">
          {/* Calendar Events Section */}
          {pastCalendarEvents.length > 0 && (
            <div className="mb-16">
              <h2 className="mb-8 text-center text-3xl font-bold text-black sm:text-4xl">
                Past Calendar Events
              </h2>
              
              {loading ? (
                <div className="text-center">
                  <p className="text-body-color dark:text-gray-300">Loading past events...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {pastCalendarEvents.map((event) => (
                    <Link
                      key={event.id}
                      href={`/lc-event-calendar/${event.id}`}
                      className="group"
                    >
                      <div className="overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-2xl">
                        <div className="p-6">
                          <div className="mb-3 flex items-center justify-between">
                            <span className="inline-block rounded bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                              {getCategoryDisplay(event.category)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatDate(event.startDate)}
                            </span>
                          </div>
                          
                          <h3 className="mb-3 text-xl font-bold text-black transition-colors group-hover:text-primary">
                            {event.title}
                          </h3>
                          
                          <p className="mb-4 line-clamp-3 text-base text-body-color">
                            {event.description}
                          </p>
                          
                          <div className="flex items-center gap-2 text-sm text-body-color">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Legacy Events Section */}
          <div>
            <h2 className="mb-8 text-center text-3xl font-bold text-black sm:text-4xl">
              Event Gallery
            </h2>
            <div className="-mx-4 flex flex-wrap justify-center">
              {/* Combine Firestore events with static events, removing duplicates */}
              {(() => {
                const firestoreSlugs = new Set(firestorePastEvents.map(e => e.slug));
                const uniqueStaticEvents = eventsData.filter(e => !firestoreSlugs.has(e.slug));
                const allEvents = [...firestorePastEvents, ...uniqueStaticEvents];
                
                return allEvents.map((event) => (
                  <div
                    key={event.id}
                    className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
                  >
                    <SingleEvent event={event} />
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LCPastEventsPage;
