'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import TagButton from "@/components/Blog/TagButton";
import dynamic from 'next/dynamic';
import type { Event } from "@/types/event";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Dynamic imports to avoid SSR issues with leaflet
const EventMap = dynamic(() => import('@/components/Events/EventMap'), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-gray-200 rounded-lg animate-pulse"></div>
});

const EventQRCode = dynamic(() => import('@/components/Events/EventQRCode'), {
  ssr: false,
});

const EventDetailsPage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Try to fetch from Firebase first
        const eventsRef = doc(db, 'lcPastEvents', slug);
        const eventSnap = await getDoc(eventsRef);
        
        if (eventSnap.exists()) {
          const data = eventSnap.data();
          setEvent({ 
            id: parseInt(eventSnap.id) || 0,
            slug: eventSnap.id,
            ...data 
          } as Event);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchEvent();
    }
  }, [slug]);

  if (loading) {
    return (
      <section className="pb-[120px] pt-[150px]">
        <div className="container">
          <div className="flex justify-center">
            <div className="w-full px-4 lg:w-8/12">
              <div className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded mb-8"></div>
                <div className="h-64 bg-gray-200 rounded mb-8"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!event) {
    return (
      <section className="pb-[120px] pt-[150px]">
        <div className="container">
          <div className="flex justify-center">
            <div className="w-full px-4 lg:w-8/12">
              <h2 className="text-3xl font-bold text-gray-900">Event Not Found</h2>
              <p className="text-gray-600 mt-4">The requested event could not be found.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="pb-[120px] pt-[150px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 lg:w-8/12">
              <div>
                <h2 className="mb-8 text-3xl font-bold leading-tight text-primary-600 dark:text-primary-400 sm:text-4xl sm:leading-tight">
                  {event.title}
                </h2>
                <div className="mb-10 flex flex-wrap items-center justify-between border-b border-body-color border-opacity-10 pb-4 dark:border-white dark:border-opacity-10">
                  <div className="flex flex-wrap items-center">
                    <div className="mb-5 mr-10 flex items-center">
                      <div className="w-full">
                        <h4 className="mb-1 text-base font-medium text-body-color">
                          Date
                        </h4>
                        <p className="text-sm text-body-color">
                          {event.date}
                        </p>
                      </div>
                    </div>
                    <div className="mb-5 flex items-center">
                      <p className="mr-5 flex items-center text-base font-medium text-body-color">
                        <span className="mr-3">
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            className="fill-current"
                          >
                            <path d="M7.5 0C5.01 0 3 2.01 3 4.5c0 3.38 4.5 10.5 4.5 10.5S12 7.88 12 4.5C12 2.01 9.99 0 7.5 0zm0 6.75c-1.24 0-2.25-1.01-2.25-2.25S6.26 2.25 7.5 2.25s2.25 1.01 2.25 2.25S8.74 6.75 7.5 6.75z"/>
                          </svg>
                        </span>
                        {event.location}
                      </p>
                    </div>
                  </div>
                  <div className="mb-5">
                    <TagButton text={event.tags[0]} />
                  </div>
                </div>
                <div>
                  <div className="mb-10 w-full overflow-hidden rounded">
                    <div className="relative aspect-[97/60] w-full sm:aspect-[97/44]">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                  </div>

                  <div className="blog-details">
                    <div dangerouslySetInnerHTML={{ __html: event.content }} />
                  </div>

                  {/* Registration QR Code */}
                  {event.registrationLink && (
                    <div className="mt-12">
                      <EventQRCode 
                        registrationLink={event.registrationLink}
                        eventTitle={event.title}
                      />
                    </div>
                  )}

                  {/* Location Map */}
                  {event.coordinates && (
                    <div className="mt-12">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Event Location</h3>
                      <EventMap
                        latitude={event.coordinates.lat}
                        longitude={event.coordinates.lng}
                        locationName={event.location}
                        eventTitle={event.title}
                      />
                      <p className="text-sm text-gray-600 mt-3 text-center">
                        <a 
                          href={`https://www.openstreetmap.org/?mlat=${event.coordinates.lat}&mlon=${event.coordinates.lng}#map=15/${event.coordinates.lat}/${event.coordinates.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View on OpenStreetMap →
                        </a>
                      </p>
                    </div>
                  )}

                  <div className="mt-12 flex flex-wrap items-center justify-between">
                    <div className="mb-5">
                      <h5 className="mb-3 text-sm font-medium text-body-color sm:text-right">
                        Tags:
                      </h5>
                      <div className="flex items-center sm:justify-end">
                        {event.tags.map((tag, index) => (
                          <TagButton key={index} text={tag} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EventDetailsPage;
