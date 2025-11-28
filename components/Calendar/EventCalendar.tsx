'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CalendarEvent } from '@/lib/firestore-schema';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';

interface EventCalendarProps {
  showFilters?: boolean;
  maxEvents?: number;
}

export default function EventCalendar({ showFilters = true, maxEvents }: EventCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, selectedCategory, currentMonth]);

  const fetchEvents = async () => {
    try {
      const eventsQuery = query(
        collection(db, 'calendarEvents'),
        where('published', '==', true),
        orderBy('startDate', 'asc')
      );
      
      const querySnapshot = await getDocs(eventsQuery);
      const eventsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startDate: data.startDate?.toDate() || new Date(),
          endDate: data.endDate?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      }) as CalendarEvent[];
      
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    if (maxEvents) {
      filtered = filtered.slice(0, maxEvents);
    }

    setFilteredEvents(filtered);
  };

  const getEventsForDay = (day: Date) => {
    return filteredEvents.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return day >= eventStart && day <= eventEnd;
    });
  };

  const getDaysInMonth = () => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      workshop: 'bg-blue-500',
      class: 'bg-green-500',
      event: 'bg-purple-500',
      meeting: 'bg-yellow-500',
      other: 'bg-gray-500'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      workshop: 'bg-blue-100 text-blue-800',
      class: 'bg-green-100 text-green-800',
      event: 'bg-purple-100 text-purple-800',
      meeting: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Event Calendar</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg ${viewMode === 'calendar' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              List
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-sm ${selectedCategory === 'all' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              All
            </button>
            {['workshop', 'class', 'event', 'meeting', 'other'].map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm capitalize ${selectedCategory === category ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {viewMode === 'calendar' ? (
        <>
          {/* Calendar Navigation */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ← Previous
            </button>
            <h3 className="text-xl font-semibold text-gray-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              Next →
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="bg-gray-50 p-2 text-center text-sm font-semibold text-gray-700">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {getDaysInMonth().map((day, idx) => {
                const dayEvents = getEventsForDay(day);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isToday = isSameDay(day, new Date());

                return (
                  <div
                    key={idx}
                    className={`bg-white min-h-24 p-2 ${!isCurrentMonth ? 'bg-gray-50' : ''} ${isToday ? 'ring-2 ring-primary' : ''}`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900'} ${isToday ? 'text-primary' : ''}`}>
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <button
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={`w-full text-left text-xs p-1 rounded ${getCategoryColor(event.category)} text-white truncate hover:opacity-80`}
                        >
                          {event.title}
                        </button>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500 pl-1">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No events found for the selected filters.
            </div>
          ) : (
            filteredEvents.map(event => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Event Thumbnail */}
                  {event.image && (
                    <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Event Details */}
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${getCategoryBadgeColor(event.category)} ml-2 flex-shrink-0`}>
                        {event.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>📅 {format(new Date(event.startDate), 'PPP p')}</p>
                      <p>📍 {event.location}</p>
                      {event.maxAttendees && (
                        <p>👥 {event.currentAttendees} / {event.maxAttendees} attendees</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedEvent(null)}>
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4">
              <span className={`inline-block text-sm px-3 py-1 rounded ${getCategoryBadgeColor(selectedEvent.category)}`}>
                {selectedEvent.category}
              </span>
            </div>

            {selectedEvent.image && (
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}

            <p className="text-gray-700 mb-6">{selectedEvent.description}</p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start">
                <span className="text-2xl mr-3">📅</span>
                <div>
                  <p className="font-semibold text-gray-900">Date & Time</p>
                  <p className="text-gray-600">
                    {format(new Date(selectedEvent.startDate), 'PPP p')} - {format(new Date(selectedEvent.endDate), 'PPP p')}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-2xl mr-3">📍</span>
                <div>
                  <p className="font-semibold text-gray-900">Location</p>
                  <p className="text-gray-600">{selectedEvent.location}</p>
                </div>
              </div>

              {selectedEvent.maxAttendees && (
                <div className="flex items-start">
                  <span className="text-2xl mr-3">👥</span>
                  <div>
                    <p className="font-semibold text-gray-900">Attendance</p>
                    <p className="text-gray-600">
                      {selectedEvent.currentAttendees} / {selectedEvent.maxAttendees} attendees
                    </p>
                    {selectedEvent.currentAttendees >= selectedEvent.maxAttendees && (
                      <p className="text-red-600 text-sm mt-1">Event is full</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {selectedEvent.registrationRequired && (
              <div className="bg-primary/10 border border-primary rounded-lg p-4 mb-4">
                <p className="text-primary font-semibold mb-2">Registration Required</p>
                {selectedEvent.registrationFormId ? (
                  <a
                    href={`/forms/public/${selectedEvent.registrationFormId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
                  >
                    Register Now
                  </a>
                ) : (
                  <p className="text-gray-600">Please contact us to register for this event.</p>
                )}
              </div>
            )}

            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
