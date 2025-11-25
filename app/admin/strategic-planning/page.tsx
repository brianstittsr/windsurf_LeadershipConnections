'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { isAdminUser } from '@/lib/adminUsers';

interface BrainstormingMethod {
  id: string;
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
  keyPoints: string[];
  bestFor: string;
  order: number;
  published: boolean;
}

const StrategicPlanningAdmin = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [methods, setMethods] = useState<BrainstormingMethod[]>([]);
  const [editingMethod, setEditingMethod] = useState<BrainstormingMethod | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'FaLightbulb',
    imageUrl: '/images/strategic-planning/default.jpg',
    keyPoints: [''],
    bestFor: '',
    order: 0,
    published: true
  });

  useEffect(() => {
    if (!loading && (!user || !isAdminUser(user.email))) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'strategicPlanningMethods'));
      const methodsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BrainstormingMethod[];
      
      methodsData.sort((a, b) => a.order - b.order);
      setMethods(methodsData);
    } catch (error) {
      console.error('Error fetching methods:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const methodData = {
        ...formData,
        keyPoints: formData.keyPoints.filter(point => point.trim() !== ''),
      };

      if (editingMethod) {
        await updateDoc(doc(db, 'strategicPlanningMethods', editingMethod.id), methodData);
      } else {
        await addDoc(collection(db, 'strategicPlanningMethods'), methodData);
      }

      resetForm();
      fetchMethods();
    } catch (error) {
      console.error('Error saving method:', error);
      alert('Error saving method. Please try again.');
    }
  };

  const handleEdit = (method: BrainstormingMethod) => {
    setEditingMethod(method);
    setFormData({
      title: method.title,
      description: method.description,
      icon: method.icon,
      imageUrl: method.imageUrl,
      keyPoints: method.keyPoints.length > 0 ? method.keyPoints : [''],
      bestFor: method.bestFor,
      order: method.order,
      published: method.published
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this brainstorming method?')) {
      try {
        await deleteDoc(doc(db, 'strategicPlanningMethods', id));
        fetchMethods();
      } catch (error) {
        console.error('Error deleting method:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: 'FaLightbulb',
      imageUrl: '/images/strategic-planning/default.jpg',
      keyPoints: [''],
      bestFor: '',
      order: 0,
      published: true
    });
    setEditingMethod(null);
    setShowForm(false);
  };

  const addKeyPoint = () => {
    setFormData({ ...formData, keyPoints: [...formData.keyPoints, ''] });
  };

  const updateKeyPoint = (index: number, value: string) => {
    const newKeyPoints = [...formData.keyPoints];
    newKeyPoints[index] = value;
    setFormData({ ...formData, keyPoints: newKeyPoints });
  };

  const removeKeyPoint = (index: number) => {
    const newKeyPoints = formData.keyPoints.filter((_, i) => i !== index);
    setFormData({ ...formData, keyPoints: newKeyPoints });
  };

  const iconOptions = [
    'FaLightbulb',
    'FaBrain',
    'FaProjectDiagram',
    'FaUsers',
    'FaChartLine',
    'FaRocket',
    'FaBullseye',
    'FaCogs',
    'FaCompass'
  ];

  if (loading || loadingData) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!user || !isAdminUser(user.email)) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Strategic Planning Methods Management
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
        >
          Add New Method
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {editingMethod ? 'Edit Brainstorming Method' : 'Add New Brainstorming Method'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Icon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-700"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Best For
              </label>
              <input
                type="text"
                value={formData.bestFor}
                onChange={(e) => setFormData({ ...formData, bestFor: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-700"
                placeholder="e.g., Complex problems requiring visual organization"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Key Points
              </label>
              {formData.keyPoints.map((point, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => updateKeyPoint(index, e.target.value)}
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-700"
                    placeholder="Enter key point"
                  />
                  <button
                    type="button"
                    onClick={() => removeKeyPoint(index)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addKeyPoint}
                className="text-primary hover:text-primary/80"
              >
                + Add Key Point
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-700"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center text-gray-700 dark:text-gray-300">
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
                {editingMethod ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6">
        {methods.map((method) => (
          <div key={method.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {method.title}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    (Order: {method.order})
                  </span>
                  {method.published ? (
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Published
                    </span>
                  ) : (
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3">{method.description}</p>
                <p className="text-sm text-primary mb-2">
                  <strong>Best For:</strong> {method.bestFor}
                </p>
                <div className="flex flex-wrap gap-2">
                  {method.keyPoints.map((point, index) => (
                    <span
                      key={index}
                      className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded"
                    >
                      {point}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(method)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(method.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {methods.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No brainstorming methods yet. Click "Add New Method" to create your first method.
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategicPlanningAdmin;
