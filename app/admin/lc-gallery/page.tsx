'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { isAdminUser } from '@/lib/adminUsers';
import Image from 'next/image';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
}

const LCGalleryPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const emptyItem: Omit<GalleryItem, 'id'> = {
    title: '',
    description: '',
    image: '/images/gallery/default.jpg',
    category: 'events',
    date: new Date().toISOString().split('T')[0],
  };

  const categories = ['events', 'classes', 'workshops', 'community', 'awards'];

  useEffect(() => {
    if (!loading && (!user || !isAdminUser(user.email))) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'lcGallery'));
        const galleryData: GalleryItem[] = [];
        querySnapshot.forEach((doc) => {
          galleryData.push({ id: doc.id, ...doc.data() } as GalleryItem);
        });
        setGalleryItems(galleryData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch (error) {
        console.error('Error fetching gallery:', error);
      }
    };

    if (user && isAdminUser(user.email)) {
      fetchGallery();
    }
  }, [user]);

  const handleSave = async (itemData: GalleryItem | Omit<GalleryItem, 'id'>) => {
    setSaving(true);
    setMessage('');

    try {
      if ('id' in itemData) {
        const docRef = doc(db, 'lcGallery', itemData.id);
        await setDoc(docRef, {
          title: itemData.title,
          description: itemData.description,
          image: itemData.image,
          category: itemData.category,
          date: itemData.date,
        });
        setGalleryItems(prev => prev.map(i => i.id === itemData.id ? itemData : i));
        setMessage('Gallery item updated successfully!');
      } else {
        const docRef = await addDoc(collection(db, 'lcGallery'), itemData);
        setGalleryItems(prev => [...prev, { id: docRef.id, ...itemData } as GalleryItem]);
        setMessage('Gallery item added successfully!');
      }
      setEditingItem(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving gallery item:', error);
      setMessage('Error saving gallery item. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;

    try {
      await deleteDoc(doc(db, 'lcGallery', id));
      setGalleryItems(prev => prev.filter(i => i.id !== id));
      setMessage('Gallery item deleted successfully!');
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      setMessage('Error deleting gallery item. Please try again.');
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user || !isAdminUser(user.email)) {
    return null;
  }

  const filteredItems = filterCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filterCategory);

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            LC Gallery
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage Leadership Connections photo gallery
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-6 rounded-lg"
        >
          Add New Photo
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-4 py-2 rounded-lg ${filterCategory === 'all' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-lg capitalize ${filterCategory === cat ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded capitalize">
                  {item.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
              <p className="text-xs text-gray-500 mb-3">{item.date}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingItem(item)}
                  className="flex-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 text-red-600 hover:text-red-800 font-medium text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {(editingItem || isAdding) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {editingItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
            </h2>
            
            <GalleryForm
              initialData={editingItem || emptyItem}
              onSave={handleSave}
              onCancel={() => {
                setEditingItem(null);
                setIsAdding(false);
              }}
              saving={saving}
              categories={categories}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const GalleryForm = ({ initialData, onSave, onCancel, saving, categories }: {
  initialData: GalleryItem | Omit<GalleryItem, 'id'>;
  onSave: (data: any) => void;
  onCancel: () => void;
  saving: boolean;
  categories: string[];
}) => {
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="capitalize">
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Image Path
        </label>
        <input
          type="text"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter the path to the image (e.g., /images/gallery/photo.jpg)
        </p>
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

export default LCGalleryPage;
