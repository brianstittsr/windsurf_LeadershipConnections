'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FaArrowLeft, FaSave, FaDatabase } from 'react-icons/fa';
import Link from 'next/link';

interface DatasetField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
  metadata?: {
    description?: string;
    placeholder?: string;
  };
}

interface DatasetSchema {
  version: string;
  fields: DatasetField[];
}

interface Dataset {
  id: string;
  name: string;
  description?: string;
  sourceApplication: string;
  sourceFormId?: string;
  sourceFormTitle?: string;
  schema: DatasetSchema;
  metadata?: {
    recordCount?: number;
    isPublic?: boolean;
    category?: string;
    tags?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export default function DatasetEditPage() {
  const params = useParams();
  const router = useRouter();
  const datasetId = params.id as string;

  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (datasetId) {
      fetchDataset();
    }
  }, [datasetId]);

  const fetchDataset = async () => {
    try {
      const datasetRef = doc(db, 'datasets', datasetId);
      const datasetSnap = await getDoc(datasetRef);

      if (datasetSnap.exists()) {
        const data = datasetSnap.data();
        const ds: Dataset = {
          id: datasetSnap.id,
          name: data.name,
          description: data.description,
          sourceApplication: data.sourceApplication,
          sourceFormId: data.sourceFormId,
          sourceFormTitle: data.sourceFormTitle,
          schema: data.schema,
          metadata: data.metadata,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
        setDataset(ds);
        setName(ds.name || '');
        setDescription(ds.description || '');
        setIsPublic(ds.metadata?.isPublic ?? true);
        setCategory(ds.metadata?.category || '');
        setTags(ds.metadata?.tags?.join(', ') || '');
      } else {
        setError('Dataset not found');
      }
    } catch (err) {
      console.error('Error fetching dataset:', err);
      setError('Failed to load dataset');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!dataset) return;

    setSaving(true);
    try {
      const datasetRef = doc(db, 'datasets', datasetId);
      await updateDoc(datasetRef, {
        name,
        description,
        metadata: {
          ...dataset.metadata,
          isPublic,
          category: category || undefined,
          tags: tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [],
        },
        updatedAt: Timestamp.fromDate(new Date()),
      });

      alert('Dataset updated successfully!');
      router.push(`/admin/datasets/${datasetId}`);
    } catch (err) {
      console.error('Error updating dataset:', err);
      alert('Failed to update dataset');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dataset) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error || 'Dataset not found'}</p>
            <Link href="/admin/datasets" className="text-blue-600 hover:underline mt-4 inline-block">
              Back to Datasets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/admin/datasets/${datasetId}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dataset
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaDatabase className="text-3xl text-blue-600 mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Dataset</h1>
                <p className="text-gray-600">{dataset.name}</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              <FaSave className="mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dataset Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter dataset name"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter dataset description"
              />
            </div>

            {/* Source Info (Read-only) */}
            {dataset.sourceFormTitle && (
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Form
                </label>
                <p className="text-gray-600">{dataset.sourceFormTitle}</p>
                <p className="text-xs text-gray-400 mt-1">Form ID: {dataset.sourceFormId}</p>
              </div>
            )}

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Events, Registrations, Surveys"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 2024, youth, leadership"
              />
            </div>

            {/* Public Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Public Dataset
                </label>
                <p className="text-xs text-gray-500">
                  Public datasets can be viewed by all authenticated users
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Schema Info (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schema Fields ({dataset.schema?.fields?.length || 0} fields)
              </label>
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                {dataset.schema?.fields?.map((field, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                    <div>
                      <span className="font-medium text-gray-900">{field.label || field.name}</span>
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </div>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                      {field.type}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Schema fields are automatically synced from the source form
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
