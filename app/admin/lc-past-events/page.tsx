'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { isAdminUser } from '@/lib/adminUsers';
import EnhanceWithAI from '@/components/Admin/EnhanceWithAI';

interface EventItem {
  id: string;
  slug: string;
  title: string;
  paragraph: string;
  image: string;
  date: string;
  location: string;
  tags: string[];
  content?: string;
  published?: boolean;
  registrationLink?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

const LCPastEventsPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const emptyEvent: Omit<EventItem, 'id'> = {
    slug: '',
    title: '',
    paragraph: '',
    image: '/images/events/default.jpg',
    date: '',
    location: '',
    tags: [],
  };

  useEffect(() => {
    if (!loading && (!user || !isAdminUser(user.email))) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'lcPastEvents'));
        const eventsData: EventItem[] = [];
        querySnapshot.forEach((doc) => {
          eventsData.push({ id: doc.id, ...doc.data() } as EventItem);
        });
        setEvents(eventsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    if (user && isAdminUser(user.email)) {
      fetchEvents();
    }
  }, [user]);

  const handleSave = async (eventData: EventItem | Omit<EventItem, 'id'>) => {
    setSaving(true);
    setMessage('');

    try {
      if ('id' in eventData) {
        const docRef = doc(db, 'lcPastEvents', eventData.id);
        await setDoc(docRef, {
          slug: eventData.slug,
          title: eventData.title,
          paragraph: eventData.paragraph,
          image: eventData.image,
          date: eventData.date,
          location: eventData.location,
          tags: eventData.tags,
          content: eventData.content || '',
          published: eventData.published !== undefined ? eventData.published : true,
        });
        setEvents(prev => prev.map(e => e.id === eventData.id ? eventData : e));
        setMessage('Event updated successfully!');
      } else {
        const newEventData = {
          ...eventData,
          content: eventData.content || '',
          published: eventData.published !== undefined ? eventData.published : true,
        };
        const docRef = await addDoc(collection(db, 'lcPastEvents'), newEventData);
        setEvents(prev => [...prev, { id: docRef.id, ...newEventData } as EventItem]);
        setMessage('Event added successfully!');
      }
      setEditingEvent(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving event:', error);
      setMessage('Error saving event. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await deleteDoc(doc(db, 'lcPastEvents', id));
      setEvents(prev => prev.filter(e => e.id !== id));
      setMessage('Event deleted successfully!');
    } catch (error) {
      console.error('Error deleting event:', error);
      setMessage('Error deleting event. Please try again.');
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user || !isAdminUser(user.email)) {
    return null;
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            LC Past Events
          </h1>
          <p className="text-gray-600">
            Manage Leadership Connections past events
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-6 rounded-lg"
        >
          Add New Event
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="grid gap-4 mb-8">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-2">{event.paragraph}</p>
                <p className="text-sm text-gray-500">Date: {event.date} | Location: {event.location}</p>
                <div className="flex gap-2 mt-2">
                  {event.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingEvent(event)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(editingEvent || isAdding) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h2>
            
            <EventForm
              initialData={editingEvent || emptyEvent}
              onSave={handleSave}
              onCancel={() => {
                setEditingEvent(null);
                setIsAdding(false);
              }}
              saving={saving}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const EventForm = ({ initialData, onSave, onCancel, saving }: {
  initialData: EventItem | Omit<EventItem, 'id'>;
  onSave: (data: any) => void;
  onCancel: () => void;
  saving: boolean;
}) => {
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug (URL)
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="text"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
          required
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <EnhanceWithAI
            currentText={formData.paragraph}
            onEnhanced={(enhancedText) => setFormData({ ...formData, paragraph: enhancedText })}
            fieldName="event description"
          />
        </div>
        <textarea
          value={formData.paragraph}
          onChange={(e) => setFormData({ ...formData, paragraph: e.target.value })}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image Path
        </label>
        <input
          type="text"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={formData.tags.join(', ')}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Article Content (HTML)
        </label>
        <textarea
          value={formData.content || ''}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={12}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 font-mono text-sm"
          placeholder="Enter HTML content for the full article..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Use HTML with Tailwind classes for styling. This will be displayed on the event detail page.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Registration Link (optional)
        </label>
        <input
          type="url"
          value={formData.registrationLink || ''}
          onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
          placeholder="https://example.com/register"
        />
        <p className="text-xs text-gray-500 mt-1">
          If provided, a QR code will be displayed on the event detail page for easy registration.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Latitude (optional)
          </label>
          <input
            type="number"
            step="any"
            value={formData.coordinates?.lat || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              coordinates: { 
                lat: parseFloat(e.target.value) || 0, 
                lng: formData.coordinates?.lng || 0 
              } 
            })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
            placeholder="35.7796"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Longitude (optional)
          </label>
          <input
            type="number"
            step="any"
            value={formData.coordinates?.lng || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              coordinates: { 
                lat: formData.coordinates?.lat || 0, 
                lng: parseFloat(e.target.value) || 0 
              } 
            })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
            placeholder="-78.6382"
          />
        </div>
        <p className="text-xs text-gray-500 col-span-2">
          If provided, an OpenStreetMap will be displayed on the event detail page. Find coordinates at <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenStreetMap.org</a>
        </p>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="published"
          checked={formData.published !== false}
          onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
          className="h-4 w-4 text-primary border-gray-300 rounded"
        />
        <label htmlFor="published" className="ml-2 text-sm font-medium text-gray-700">
          Published (visible on site)
        </label>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-6 rounded-lg disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default LCPastEventsPage;
