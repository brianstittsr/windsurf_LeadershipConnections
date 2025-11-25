'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DatasetField, DatasetFieldType } from '@/lib/dataset-schema';
import { FaPlus, FaTrash, FaSave, FaTimes, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

const FIELD_TYPES: { value: DatasetFieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'url', label: 'URL' },
  { value: 'date', label: 'Date' },
  { value: 'boolean', label: 'Yes/No' },
  { value: 'select', label: 'Dropdown' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'checkbox', label: 'Checkboxes' },
  { value: 'array', label: 'Array' },
  { value: 'json', label: 'JSON' },
];

const CATEGORIES = [
  'general',
  'forms',
  'surveys',
  'events',
  'contacts',
  'feedback',
  'registrations',
  'applications',
  'other',
];

export default function CreateDatasetPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sourceApplication: 'LeadershipConnections',
    category: 'general',
    tags: [] as string[],
    isPublic: false,
  });

  const [fields, setFields] = useState<DatasetField[]>([
    {
      name: 'id',
      label: 'ID',
      type: 'text' as DatasetFieldType,
      required: true,
      unique: true,
      indexed: true,
      metadata: {
        description: 'Unique identifier for each record',
      },
    },
  ]);

  const [newTag, setNewTag] = useState('');
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);

  const handleAddField = () => {
    const newField: DatasetField = {
      name: `field_${fields.length}`,
      label: `Field ${fields.length}`,
      type: 'text',
      required: false,
    };
    setFields([...fields, newField]);
    setEditingFieldIndex(fields.length);
  };

  const handleUpdateField = (index: number, updates: Partial<DatasetField>) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], ...updates };
    setFields(updatedFields);
  };

  const handleRemoveField = (index: number) => {
    if (index === 0) {
      alert('Cannot remove the ID field');
      return;
    }
    setFields(fields.filter((_, i) => i !== index));
    if (editingFieldIndex === index) {
      setEditingFieldIndex(null);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to create a dataset');
      return;
    }

    if (fields.length === 0) {
      alert('Please add at least one field');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/datasets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          sourceApplication: formData.sourceApplication,
          organizationId: 'default', // TODO: Get from user context
          createdBy: user.uid,
          schema: {
            fields: fields,
            version: '1.0.0',
          },
          metadata: {
            tags: formData.tags,
            category: formData.category,
            isPublic: formData.isPublic,
          },
          permissions: {
            owners: [user.uid],
            editors: [],
            viewers: [],
            publicRead: formData.isPublic,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/admin/datasets/${data.dataset.id}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating dataset:', error);
      alert('Failed to create dataset');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/datasets"
          className="text-primary hover:text-primary/80 flex items-center gap-2 mb-4"
        >
          <FaArrowLeft />
          Back to Datasets
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create New Dataset</h1>
        <p className="text-gray-600 mt-2">
          Define the structure and fields for your new dataset
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dataset Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., Contact Form Submissions"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Describe what this dataset contains and its purpose"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Application
                </label>
                <input
                  type="text"
                  value={formData.sourceApplication}
                  onChange={(e) => setFormData({ ...formData, sourceApplication: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Add a tag..."
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-primary/70"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="mr-2 w-4 h-4"
                />
                <span className="text-sm">Make this dataset publicly accessible</span>
              </label>
            </div>
          </div>
        </div>

        {/* Schema Definition */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Schema Definition</h2>
            <button
              type="button"
              onClick={handleAddField}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
            >
              <FaPlus />
              Add Field
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  editingFieldIndex === index ? 'border-primary bg-primary/5' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Field Name
                      </label>
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => handleUpdateField(index, { name: e.target.value })}
                        disabled={index === 0}
                        className="w-full border border-gray-300 rounded px-3 py-1 text-sm disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Label
                      </label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => handleUpdateField(index, { label: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Type
                      </label>
                      <select
                        value={field.type}
                        onChange={(e) => handleUpdateField(index, { type: e.target.value as DatasetFieldType })}
                        disabled={index === 0}
                        className="w-full border border-gray-300 rounded px-3 py-1 text-sm disabled:bg-gray-100"
                      >
                        {FIELD_TYPES.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-3">
                    <button
                      type="button"
                      onClick={() => setEditingFieldIndex(editingFieldIndex === index ? null : index)}
                      className="text-primary hover:text-primary/70 text-sm"
                    >
                      {editingFieldIndex === index ? 'Done' : 'Edit'}
                    </button>
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveField(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>

                {editingFieldIndex === index && (
                  <div className="space-y-3 pt-3 border-t border-gray-200">
                    <div className="flex gap-4">
                      <label className="flex items-center text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => handleUpdateField(index, { required: e.target.checked })}
                          className="mr-2"
                        />
                        Required
                      </label>
                      <label className="flex items-center text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={field.unique || false}
                          onChange={(e) => handleUpdateField(index, { unique: e.target.checked })}
                          className="mr-2"
                        />
                        Unique
                      </label>
                      <label className="flex items-center text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={field.indexed || false}
                          onChange={(e) => handleUpdateField(index, { indexed: e.target.checked })}
                          className="mr-2"
                        />
                        Indexed
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={field.metadata?.description || ''}
                        onChange={(e) => handleUpdateField(index, {
                          metadata: { ...field.metadata, description: e.target.value }
                        })}
                        className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
                        placeholder="Describe this field..."
                      />
                    </div>

                    {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Options (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={field.options?.join(', ') || ''}
                          onChange={(e) => handleUpdateField(index, {
                            options: e.target.value.split(',').map(o => o.trim()).filter(Boolean)
                          })}
                          className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
                          placeholder="Option 1, Option 2, Option 3"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin/datasets"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              <>
                <FaSave />
                Create Dataset
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
