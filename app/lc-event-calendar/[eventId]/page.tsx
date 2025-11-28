'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Breadcrumb from '@/components/Common/Breadcrumb';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  category: string;
  published: boolean;
  image?: string;
  maxAttendees?: number;
  currentAttendees?: number;
  registrationRequired?: boolean;
}

const EventDetailPage = () => {
  const params = useParams();
  const eventId = params.eventId as string;
  const [event, setEvent] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventDoc = await getDoc(doc(db, 'calendarEvents', eventId));
        
        if (eventDoc.exists()) {
          const data = eventDoc.data();
          setEvent({
            id: eventDoc.id,
            title: data.title,
            description: data.description,
            startDate: data.startDate.toDate(),
            endDate: data.endDate.toDate(),
            location: data.location,
            category: data.category || 'event',
            published: data.published,
            image: data.image,
            maxAttendees: data.maxAttendees,
            currentAttendees: data.currentAttendees || 0,
            registrationRequired: data.registrationRequired,
          });
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
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

  const getGoogleMapsUrl = (location: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  };

  const getEventUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  const handleShare = async () => {
    const eventUrl = getEventUrl();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title,
          text: `Check out this event: ${event?.title}`,
          url: eventUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      setShowQR(true);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-body-color">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-black">Event Not Found</h2>
          <Link href="/lc-event-calendar" className="text-primary hover:underline">
            Back to Event Calendar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        pageName={event.title}
        description="Event Details"
      />

      <section className="pb-[120px] pt-[120px]">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            {/* Back Button */}
            <Link
              href="/lc-event-calendar"
              className="mb-8 inline-flex items-center gap-2 text-primary hover:underline"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Calendar
            </Link>

            {/* Event Header */}
            <div className="mb-8 rounded-2xl bg-white p-8 shadow-xl">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <span className="inline-block rounded bg-primary/10 px-4 py-2 text-sm font-semibold text-primary uppercase">
                  {getCategoryDisplay(event.category)}
                </span>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-white transition-all hover:bg-primary/90"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share Event
                </button>
              </div>

              <h1 className="mb-6 text-3xl font-bold text-black sm:text-4xl md:text-5xl">
                {event.title}
              </h1>

              {/* Event Meta Info */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Date</p>
                    <p className="text-base font-medium text-black">{formatDate(event.startDate)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Time</p>
                    <p className="text-base font-medium text-black">
                      {formatTime(event.startDate)} - {formatTime(event.endDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Location</p>
                    <p className="text-base font-medium text-black">{event.location}</p>
                  </div>
                </div>
              </div>

              {event.maxAttendees && (
                <div className="mt-6 rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Attendees: {event.currentAttendees} / {event.maxAttendees}
                    </span>
                    <div className="h-2 w-48 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${((event.currentAttendees || 0) / event.maxAttendees) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Event Description */}
            <div className="mb-8 rounded-2xl bg-white p-8 shadow-xl">
              <h2 className="mb-4 text-2xl font-bold text-black">About This Event</h2>
              <p className="whitespace-pre-line text-base leading-relaxed text-body-color">
                {event.description}
              </p>
            </div>

            {/* Location Map */}
            <div className="mb-8 rounded-2xl bg-white p-8 shadow-xl">
              <h2 className="mb-4 text-2xl font-bold text-black">Location</h2>
              <p className="mb-4 text-base text-body-color">{event.location}</p>
              
              {/* Google Maps Embed */}
              <div className="mb-4 overflow-hidden rounded-lg">
                <iframe
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&q=${encodeURIComponent(event.location)}`}
                />
              </div>

              <a
                href={getGoogleMapsUrl(event.location)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open in Google Maps
              </a>
            </div>

            {/* QR Code Section */}
            <div className="rounded-2xl bg-white p-8 shadow-xl">
              <h2 className="mb-4 text-2xl font-bold text-black">Share This Event</h2>
              <p className="mb-6 text-base text-body-color">
                Scan this QR code with your smartphone camera to share the event location and details
              </p>

              <div className="flex flex-col items-center gap-6 sm:flex-row">
                {/* QR Code for Event URL */}
                <div className="rounded-lg bg-white p-6 shadow-lg">
                  <QRCodeSVG
                    value={getEventUrl()}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                  <p className="mt-3 text-center text-sm font-medium text-gray-600">Event Details</p>
                </div>

                {/* QR Code for Google Maps Location */}
                <div className="rounded-lg bg-white p-6 shadow-lg">
                  <QRCodeSVG
                    value={getGoogleMapsUrl(event.location)}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                  <p className="mt-3 text-center text-sm font-medium text-gray-600">Event Location</p>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <svg className="h-6 w-6 flex-shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-900">How to use QR codes:</p>
                    <ul className="mt-2 list-inside list-disc text-sm text-blue-800">
                      <li>Open your smartphone camera app</li>
                      <li>Point it at the QR code</li>
                      <li>Tap the notification to open the link</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration CTA */}
            {event.registrationRequired && (
              <div className="mt-8 rounded-2xl bg-gradient-to-r from-primary to-purple-600 p-8 text-center text-white shadow-xl">
                <h3 className="mb-4 text-2xl font-bold">Ready to Join?</h3>
                <p className="mb-6 text-lg">Register now to secure your spot at this event!</p>
                <button className="rounded-lg bg-white px-8 py-3 font-semibold text-primary transition-all hover:bg-gray-100">
                  Register Now
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default EventDetailPage;
