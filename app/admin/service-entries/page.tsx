'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ServiceEntry } from '@/lib/firestore-schema';
import Link from 'next/link';
import EnhanceWithAI from '@/components/Admin/EnhanceWithAI';

const ServiceEntriesAdmin = () => {
  const [services, setServices] = useState<ServiceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<ServiceEntry | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    paragraph: '',
    content: '',
    image: '/images/services/service-01.jpg',
    author: {
      name: 'Katherine Harreleson',
      image: '/images/blog/author-01.png',
      designation: 'Program Director'
    },
    tags: [''],
    publishDate: new Date().toISOString().split('T')[0],
    active: true
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'serviceEntries'));
      const servicesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ServiceEntry[];
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const serviceData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (editingService) {
        await updateDoc(doc(db, 'serviceEntries', editingService.id), {
          ...serviceData,
          updatedAt: new Date()
        });
      } else {
        await addDoc(collection(db, 'serviceEntries'), serviceData);
      }

      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleEdit = (service: ServiceEntry) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      slug: service.slug,
      paragraph: service.paragraph,
      content: service.content,
      image: service.image,
      author: service.author,
      tags: service.tags.length > 0 ? service.tags : [''],
      publishDate: service.publishDate,
      active: service.active
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service entry?')) {
      try {
        await deleteDoc(doc(db, 'serviceEntries', id));
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      paragraph: '',
      content: '',
      image: '/images/services/service-01.jpg',
      author: {
        name: 'Katherine Harreleson',
        image: '/images/blog/author-01.png',
        designation: 'Program Director'
      },
      tags: [''],
      publishDate: new Date().toISOString().split('T')[0],
      active: true
    });
    setEditingService(null);
    setShowForm(false);
  };

  const addTag = () => {
    setFormData({ ...formData, tags: [...formData.tags, ''] });
  };

  const updateTag = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData({ ...formData, tags: newTags });
  };

  const removeTag = (index: number) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData({ ...formData, tags: newTags });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Service Entries Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
        >
          Add New Service
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            {editingService ? 'Edit Service Entry' : 'Add New Service Entry'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    title: e.target.value,
                    slug: generateSlug(e.target.value)
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  required
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <EnhanceWithAI
                  currentText={formData.paragraph}
                  onEnhanced={(enhancedText) => setFormData({ ...formData, paragraph: enhancedText })}
                  fieldName="service description"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Content (HTML)</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={8}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 font-mono text-sm"
                placeholder="Enter HTML content..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image Path</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Publish Date</label>
                <input
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => updateTag(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                    placeholder="Enter tag"
                  />
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTag}
                className="text-primary hover:text-primary/80"
              >
                + Add Tag
              </button>
            </div>

            <div>
              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="mr-2"
                />
                Active Service
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
              >
                {editingService ? 'Update' : 'Create'}
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
        {services.map((service) => (
          <div key={service.id} className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                <p className="text-gray-600">/services/{service.slug}</p>
                <div className="flex items-center mt-2">
                  {service.active ? (
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Active
                    </span>
                  ) : (
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      Inactive
                    </span>
                  )}
                  <span className="ml-2 text-sm text-gray-500">{service.publishDate}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link
                  href={`/services/${service.slug}`}
                  className="text-green-600 hover:text-green-800"
                  target="_blank"
                >
                  View
                </Link>
                <button
                  onClick={() => handleEdit(service)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{service.paragraph}</p>
            <div className="flex flex-wrap gap-2">
              {service.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceEntriesAdmin;
