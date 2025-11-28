'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CalendarEvent } from '@/lib/firestore-schema';
import { format } from 'date-fns';
import { addSampleCalendarEvent, addMultipleSampleEvents } from '@/lib/add-sample-event';

const EventsPage = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [collapsedEntries, setCollapsedEntries] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '09:00',
    endDate: '',
    endTime: '17:00',
    location: '',
    image: '',
    category: 'event' as 'workshop' | 'class' | 'event' | 'meeting' | 'other',
    maxAttendees: '',
    registrationRequired: false,
    registrationFormId: '',
    published: false,
    coordinates: { lat: 0, lng: 0 }
  });

  const [geocoding, setGeocoding] = useState(false);
  const [geocodeMessage, setGeocodeMessage] = useState('');

  useEffect(() => {
    fetchEvents();
    fetchForms();
  }, []);

  const fetchEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'calendarEvents'));
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
      
      // Sort by start date
      eventsData.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchForms = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'customForms'));
      const formsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setForms(formsData);
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      const eventData = {
        title: formData.title,
        description: formData.description,
        startDate: Timestamp.fromDate(startDateTime),
        endDate: Timestamp.fromDate(endDateTime),
        location: formData.location,
        image: formData.image || '',
        category: formData.category,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
        currentAttendees: 0,
        registrationRequired: formData.registrationRequired,
        registrationFormId: formData.registrationFormId || undefined,
        published: formData.published,
        coordinates: (formData.coordinates.lat !== 0 || formData.coordinates.lng !== 0) ? formData.coordinates : undefined,
        updatedAt: Timestamp.fromDate(new Date())
      };

      if (editingEvent) {
        await updateDoc(doc(db, 'calendarEvents', editingEvent.id), eventData);
      } else {
        await addDoc(collection(db, 'calendarEvents'), {
          ...eventData,
          createdAt: Timestamp.fromDate(new Date())
        });
      }

      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event. Please try again.');
    }
  };

  const handleEdit = (event: CalendarEvent) => {
    setEditingEvent(event);
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    setFormData({
      title: event.title,
      description: event.description,
      startDate: format(startDate, 'yyyy-MM-dd'),
      startTime: format(startDate, 'HH:mm'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      endTime: format(endDate, 'HH:mm'),
      location: event.location,
      image: event.image || '',
      category: event.category,
      maxAttendees: event.maxAttendees?.toString() || '',
      registrationRequired: event.registrationRequired,
      registrationFormId: event.registrationFormId || '',
      published: event.published,
      coordinates: (event as any).coordinates || { lat: 0, lng: 0 }
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteDoc(doc(db, 'calendarEvents', id));
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startDate: '',
      startTime: '09:00',
      endDate: '',
      endTime: '17:00',
      location: '',
      image: '',
      category: 'event',
      maxAttendees: '',
      registrationRequired: false,
      registrationFormId: '',
      published: false,
      coordinates: { lat: 0, lng: 0 }
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  const getCategoryColor = (category: string) => {
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
    return <div className="text-center py-8">Loading...</div>;
  }

  const handleAddSampleEvents = async () => {
    if (confirm('Add 3 sample events to the calendar?')) {
      const result = await addMultipleSampleEvents();
      if (result.success) {
        alert(result.message);
        fetchEvents();
      } else {
        alert('Error adding sample events: ' + result.error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Event Calendar Management</h1>
        <div className="flex gap-3">
          <button
            onClick={handleAddSampleEvents}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Sample Events
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
          >
            Add New Event
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            {editingEvent ? 'Edit Event' : 'Add New Event'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  placeholder="123 Main St, Durham, NC 27701"
                  required
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (!formData.location) {
                      setGeocodeMessage('Please enter a location first');
                      return;
                    }
                    setGeocoding(true);
                    setGeocodeMessage('');
                    try {
                      // Use Nominatim (OpenStreetMap) geocoding service
                      const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.location)}&limit=1`,
                        {
                          headers: {
                            'User-Agent': 'LeadershipConnections/1.0'
                          }
                        }
                      );
                      const data = await response.json();
                      if (data && data.length > 0) {
                        const { lat, lon } = data[0];
                        setFormData({
                          ...formData,
                          coordinates: {
                            lat: parseFloat(lat),
                            lng: parseFloat(lon)
                          }
                        });
                        setGeocodeMessage(`✓ Coordinates found: ${parseFloat(lat).toFixed(6)}, ${parseFloat(lon).toFixed(6)}`);
                      } else {
                        setGeocodeMessage('✗ Location not found. Try a more specific address.');
                      }
                    } catch (error) {
                      console.error('Geocoding error:', error);
                      setGeocodeMessage('✗ Error geocoding address');
                    } finally {
                      setGeocoding(false);
                    }
                  }}
                  disabled={geocoding || !formData.location}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
                >
                  {geocoding ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Geocoding...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Get Coordinates
                    </>
                  )}
                </button>
              </div>
              {geocodeMessage && (
                <p className={`mt-2 text-sm ${
                  geocodeMessage.startsWith('✓') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {geocodeMessage}
                </p>
              )}
            </div>

            {formData.coordinates && (formData.coordinates.lat !== 0 || formData.coordinates.lng !== 0) && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.coordinates.lat}
                    onChange={(e) => setFormData({
                      ...formData,
                      coordinates: {
                        ...formData.coordinates,
                        lat: parseFloat(e.target.value) || 0
                      }
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.coordinates.lng}
                    onChange={(e) => setFormData({
                      ...formData,
                      coordinates: {
                        ...formData.coordinates,
                        lng: parseFloat(e.target.value) || 0
                      }
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                >
                  <option value="event">Event</option>
                  <option value="workshop">Workshop</option>
                  <option value="class">Class</option>
                  <option value="meeting">Meeting</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Attendees (optional)</label>
                <input
                  type="number"
                  value={formData.maxAttendees}
                  onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (optional)</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                placeholder="/images/events/event-image.jpg"
              />
            </div>

            <div>
              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.registrationRequired}
                  onChange={(e) => setFormData({ ...formData, registrationRequired: e.target.checked })}
                  className="mr-2"
                />
                Registration Required
              </label>
            </div>

            {formData.registrationRequired && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Form</label>
                <select
                  value={formData.registrationFormId}
                  onChange={(e) => setFormData({ ...formData, registrationFormId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                >
                  <option value="">Select a form...</option>
                  {forms.map(form => (
                    <option key={form.id} value={form.id}>{form.title}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="mr-2"
                />
                Published
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
              >
                {editingEvent ? 'Update Event' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6">
        {events.map((event) => {
          const isCollapsed = collapsedEntries.has(event.id);
          const toggleCollapse = () => {
            const newCollapsed = new Set(collapsedEntries);
            if (isCollapsed) {
              newCollapsed.delete(event.id);
            } else {
              newCollapsed.add(event.id);
            }
            setCollapsedEntries(newCollapsed);
          };

          return (
            <div key={event.id} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={toggleCollapse}
                      className="text-gray-600 hover:text-gray-900 mr-2"
                      title={isCollapsed ? 'Expand entry' : 'Collapse entry'}
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isCollapsed ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        )}
                      </svg>
                    </button>
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    <span className={`inline-block text-xs px-2 py-1 rounded ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                    {event.published ? (
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Published
                      </span>
                    ) : (
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        Draft
                      </span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <>
                      <p className="text-gray-700 mb-2">{event.description}</p>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>📅 {format(new Date(event.startDate), 'PPP p')} - {format(new Date(event.endDate), 'PPP p')}</p>
                        <p>📍 {event.location}</p>
                        {event.maxAttendees && (
                          <p>👥 {event.currentAttendees} / {event.maxAttendees} attendees</p>
                        )}
                        {event.registrationRequired && (
                          <p className="text-primary">✓ Registration Required</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {events.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No events yet. Click "Add New Event" to create your first event.
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
