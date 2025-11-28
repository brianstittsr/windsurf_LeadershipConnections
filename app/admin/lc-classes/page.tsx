'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { isAdminUser } from '@/lib/adminUsers';

interface ClassItem {
  id: string;
  slug: string;
  year: string;
  title: string;
  paragraph: string;
  image: string;
  graduationDate: string;
  tags: string[];
  content?: string;
  published?: boolean;
}

const LCClassesPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const emptyClass: Omit<ClassItem, 'id'> = {
    slug: '',
    year: '',
    title: '',
    paragraph: '',
    image: '/images/classes/default.jpg',
    graduationDate: '',
    tags: [],
  };

  useEffect(() => {
    if (!loading && (!user || !isAdminUser(user.email))) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'lcPastClasses'));
        const classesData: ClassItem[] = [];
        querySnapshot.forEach((doc) => {
          classesData.push({ id: doc.id, ...doc.data() } as ClassItem);
        });
        setClasses(classesData.sort((a, b) => b.year.localeCompare(a.year)));
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    if (user && isAdminUser(user.email)) {
      fetchClasses();
    }
  }, [user]);

  const handleSave = async (classData: ClassItem | Omit<ClassItem, 'id'>) => {
    setSaving(true);
    setMessage('');

    try {
      if ('id' in classData) {
        // Update existing
        const docRef = doc(db, 'lcPastClasses', classData.id);
        await setDoc(docRef, {
          slug: classData.slug,
          year: classData.year,
          title: classData.title,
          paragraph: classData.paragraph,
          image: classData.image,
          graduationDate: classData.graduationDate,
          tags: classData.tags,
          content: classData.content || '',
          published: classData.published !== undefined ? classData.published : true,
        });
        setClasses(prev => prev.map(c => c.id === classData.id ? classData : c));
        setMessage('Class updated successfully!');
      } else {
        // Add new
        const newClassData = {
          ...classData,
          content: classData.content || '',
          published: classData.published !== undefined ? classData.published : true,
        };
        const docRef = await addDoc(collection(db, 'lcPastClasses'), newClassData);
        setClasses(prev => [...prev, { id: docRef.id, ...classData } as ClassItem]);
        setMessage('Class added successfully!');
      }
      setEditingClass(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving class:', error);
      setMessage('Error saving class. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return;

    try {
      await deleteDoc(doc(db, 'lcPastClasses', id));
      setClasses(prev => prev.filter(c => c.id !== id));
      setMessage('Class deleted successfully!');
    } catch (error) {
      console.error('Error deleting class:', error);
      setMessage('Error deleting class. Please try again.');
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
            LC Past Classes
          </h1>
          <p className="text-gray-600">
            Manage Leadership Connections past classes
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-6 rounded-lg"
        >
          Add New Class
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Class List */}
      <div className="grid gap-4 mb-8">
        {classes.map((classItem) => (
          <div key={classItem.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {classItem.title} ({classItem.year})
                </h3>
                <p className="text-gray-600 mb-2">{classItem.paragraph}</p>
                <p className="text-sm text-gray-500">Graduation: {classItem.graduationDate}</p>
                <div className="flex gap-2 mt-2">
                  {classItem.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingClass(classItem)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(classItem.id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {(editingClass || isAdding) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingClass ? 'Edit Class' : 'Add New Class'}
            </h2>
            
            <ClassForm
              initialData={editingClass || emptyClass}
              onSave={handleSave}
              onCancel={() => {
                setEditingClass(null);
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

const ClassForm = ({ initialData, onSave, onCancel, saving }: {
  initialData: ClassItem | Omit<ClassItem, 'id'>;
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
            Year
          </label>
          <input
            type="text"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
            required
          />
        </div>
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
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
          Graduation Date
        </label>
        <input
          type="text"
          value={formData.graduationDate}
          onChange={(e) => setFormData({ ...formData, graduationDate: e.target.value })}
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
          Use HTML with Tailwind classes for styling. This will be displayed on the class detail page.
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

export default LCClassesPage;
