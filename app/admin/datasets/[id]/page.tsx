'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FaArrowLeft, FaDatabase, FaCalendar, FaTag, FaTable, FaDownload } from 'react-icons/fa';
import Link from 'next/link';

interface DatasetSchema {
  fields: Array<{
    name: string;
    type: string;
    required?: boolean;
    description?: string;
  }>;
}

interface DatasetMetadata {
  category?: string;
  tags?: string[];
  recordCount?: number;
  lastSync?: Date;
  isPublic?: boolean;
}

interface Dataset {
  id: string;
  name: string;
  description?: string;
  sourceApplication: string;
  schema: DatasetSchema;
  metadata?: DatasetMetadata;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export default function DatasetViewPage() {
  const params = useParams();
  const router = useRouter();
  const datasetId = params.id as string;
  
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setDataset({
          id: datasetSnap.id,
          name: data.name,
          description: data.description,
          sourceApplication: data.sourceApplication,
          schema: data.schema,
          metadata: data.metadata,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          createdBy: data.createdBy,
        });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dataset...</p>
        </div>
      </div>
    );
  }

  if (error || !dataset) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-900 mb-2">Error</h2>
          <p className="text-red-700 mb-4">{error || 'Dataset not found'}</p>
          <Link
            href="/admin/datasets"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <FaArrowLeft />
            Back to Datasets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/datasets"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <FaArrowLeft />
          Back to Datasets
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{dataset.name}</h1>
            {dataset.description && (
              <p className="text-gray-600 text-lg">{dataset.description}</p>
            )}
          </div>
          <span className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium">
            {dataset.metadata?.category || 'general'}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaTable className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Records</p>
              <p className="text-2xl font-bold text-gray-900">
                {(dataset.metadata?.recordCount || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <FaDatabase className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Fields</p>
              <p className="text-2xl font-bold text-gray-900">
                {dataset.schema?.fields?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FaCalendar className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Created</p>
              <p className="text-sm font-semibold text-gray-900">
                {dataset.createdAt.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <FaTag className="text-orange-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tags</p>
              <p className="text-2xl font-bold text-gray-900">
                {dataset.metadata?.tags?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Schema Section */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaTable />
                Schema Fields
              </h2>
            </div>
            <div className="p-6">
              {dataset.schema?.fields && dataset.schema.fields.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Field Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Required</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataset.schema.fields.map((field, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{field.name}</td>
                          <td className="py-3 px-4">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                              {field.type}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {field.required ? (
                              <span className="text-green-600 font-medium">Yes</span>
                            ) : (
                              <span className="text-gray-400">No</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {field.description || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No schema fields defined</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Metadata */}
        <div className="space-y-6">
          {/* Dataset Info */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Dataset Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Source Application</p>
                <p className="font-medium text-gray-900">{dataset.sourceApplication}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Created</p>
                <p className="font-medium text-gray-900">
                  {dataset.createdAt.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                <p className="font-medium text-gray-900">
                  {dataset.updatedAt.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              {dataset.metadata?.lastSync && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Last Sync</p>
                  <p className="font-medium text-gray-900">
                    {new Date(dataset.metadata.lastSync).toLocaleDateString()}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600 mb-1">Visibility</p>
                <p className="font-medium text-gray-900">
                  {dataset.metadata?.isPublic ? (
                    <span className="text-green-600">Public</span>
                  ) : (
                    <span className="text-gray-600">Private</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {dataset.metadata?.tags && dataset.metadata.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {dataset.metadata.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => router.push(`/admin/datasets/${dataset.id}/edit`)}
                className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Edit Dataset
              </button>
              <button
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <FaDownload />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
