'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { isAdminUser } from '@/lib/adminUsers';

interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

const LCServicesPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const emptyService: Omit<ServiceItem, 'id'> = {
    slug: '',
    title: '',
    description: '',
    icon: '📚',
    features: [],
  };

  useEffect(() => {
    if (!loading && (!user || !isAdminUser(user.email))) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'lcServices'));
        const servicesData: ServiceItem[] = [];
        querySnapshot.forEach((doc) => {
          servicesData.push({ id: doc.id, ...doc.data() } as ServiceItem);
        });
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    if (user && isAdminUser(user.email)) {
      fetchServices();
    }
  }, [user]);

  const handleSave = async (serviceData: ServiceItem | Omit<ServiceItem, 'id'>) => {
    setSaving(true);
    setMessage('');

    try {
      if ('id' in serviceData) {
        const docRef = doc(db, 'lcServices', serviceData.id);
        await setDoc(docRef, {
          slug: serviceData.slug,
          title: serviceData.title,
          description: serviceData.description,
          icon: serviceData.icon,
          features: serviceData.features,
        });
        setServices(prev => prev.map(s => s.id === serviceData.id ? serviceData : s));
        setMessage('Service updated successfully!');
      } else {
        const docRef = await addDoc(collection(db, 'lcServices'), serviceData);
        setServices(prev => [...prev, { id: docRef.id, ...serviceData } as ServiceItem]);
        setMessage('Service added successfully!');
      }
      setEditingService(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving service:', error);
      setMessage('Error saving service. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await deleteDoc(doc(db, 'lcServices', id));
      setServices(prev => prev.filter(s => s.id !== id));
      setMessage('Service deleted successfully!');
    } catch (error) {
      console.error('Error deleting service:', error);
      setMessage('Error deleting service. Please try again.');
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            LC Services
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage Leadership Connections services
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-6 rounded-lg"
        >
          Add New Service
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="grid gap-4 mb-8">
        {services.map((service) => (
          <div key={service.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{service.icon}</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {service.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-3">{service.description}</p>
                <div className="space-y-1">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                      • {feature}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingService(service)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(editingService || isAdding) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h2>
            
            <ServiceForm
              initialData={editingService || emptyService}
              onSave={handleSave}
              onCancel={() => {
                setEditingService(null);
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

const ServiceForm = ({ initialData, onSave, onCancel, saving }: {
  initialData: ServiceItem | Omit<ServiceItem, 'id'>;
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Slug (URL)
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Icon (emoji)
          </label>
          <input
            type="text"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Features (one per line)
        </label>
        <textarea
          value={formData.features.join('\n')}
          onChange={(e) => setFormData({ ...formData, features: e.target.value.split('\n').filter(f => f.trim()) })}
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter each feature on a new line"
        />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
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

export default LCServicesPage;
