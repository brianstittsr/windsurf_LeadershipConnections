'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Dataset } from '@/lib/dataset-schema';
import Link from 'next/link';
import { 
  FaDatabase, 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaChartBar, 
  FaDownload,
  FaEdit,
  FaTrash,
  FaCopy,
  FaEye,
  FaKey
} from 'react-icons/fa';

export default function DatasetsPage() {
  const { user } = useAuth();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDatasets();
    }
  }, [user]);

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/datasets');
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch datasets:', errorData);
        alert(`Error loading datasets: ${errorData.error || 'Unknown error'}. Make sure you are signed in as an admin.`);
        setDatasets([]);
        return;
      }
      
      const data = await response.json();
      setDatasets(data.datasets || []);
    } catch (error) {
      console.error('Error fetching datasets:', error);
      alert('Error loading datasets. Make sure you are signed in as an admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDataset = async (datasetId: string) => {
    if (!confirm('Are you sure you want to delete this dataset? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/datasets/${datasetId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchDatasets();
      } else {
        alert('Failed to delete dataset');
      }
    } catch (error) {
      console.error('Error deleting dataset:', error);
      alert('Error deleting dataset');
    }
  };

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || dataset.metadata.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(datasets.map(d => d.metadata.category)));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading datasets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FaDatabase className="text-primary" />
              DataHub Admin
            </h1>
            <p className="text-gray-600 mt-2">
              Centralized data management and analytics platform
            </p>
          </div>
          <Link
            href="/admin/datasets/create"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 flex items-center gap-2 shadow-lg"
          >
            <FaPlus />
            Create Dataset
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Datasets</p>
                <p className="text-2xl font-bold text-gray-900">{datasets.length}</p>
              </div>
              <FaDatabase className="text-3xl text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">
                  {datasets.reduce((sum, d) => sum + d.metadata.recordCount, 0).toLocaleString()}
                </p>
              </div>
              <FaChartBar className="text-3xl text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Sources</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(datasets.map(d => d.sourceApplication)).size}
                </p>
              </div>
              <FaKey className="text-3xl text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
              <FaFilter className="text-3xl text-orange-500" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search datasets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Datasets Grid */}
      {filteredDatasets.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FaDatabase className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Datasets Found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterCategory !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first dataset'}
          </p>
          {!searchTerm && filterCategory === 'all' && (
            <Link
              href="/admin/datasets/create"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90"
            >
              <FaPlus />
              Create Your First Dataset
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDatasets.map(dataset => (
            <div
              key={dataset.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {dataset.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {dataset.description || 'No description'}
                    </p>
                  </div>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    {dataset.metadata.category}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Records:</span>
                    <span className="font-semibold text-gray-900">
                      {dataset.metadata.recordCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Fields:</span>
                    <span className="font-semibold text-gray-900">
                      {dataset.schema.fields.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Source:</span>
                    <span className="font-semibold text-gray-900 text-xs">
                      {dataset.sourceApplication}
                    </span>
                  </div>
                </div>

                {dataset.metadata.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {dataset.metadata.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {dataset.metadata.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{dataset.metadata.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <Link
                    href={`/admin/datasets/${dataset.id}`}
                    className="flex-1 bg-primary text-white px-3 py-2 rounded text-sm hover:bg-primary/90 flex items-center justify-center gap-2"
                  >
                    <FaEye />
                    View
                  </Link>
                  <Link
                    href={`/admin/datasets/${dataset.id}/edit`}
                    className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 flex items-center justify-center"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    onClick={() => handleDeleteDataset(dataset.id)}
                    className="bg-red-50 text-red-600 px-3 py-2 rounded text-sm hover:bg-red-100 flex items-center justify-center"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
