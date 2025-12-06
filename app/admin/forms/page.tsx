'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CustomForm } from '@/lib/firestore-schema';
import { FormField, FormTemplate, formTemplates } from '@/types/form';
import Link from 'next/link';
import { generateFormQRCode, generateFormPublicUrl } from '@/lib/qrcode-utils';
import { getDatasetForForm, deleteDataset, unlinkFormFromDataset, getDatasetStats, ensureDatasetForForm } from '@/lib/datahub-service';
import { downloadPaperFormPDF } from '@/lib/paper-form-generator';
import { downloadSurveyPoster } from '@/lib/survey-poster-generator';

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const FormsPage = () => {
  const [forms, setForms] = useState<CustomForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingForm, setEditingForm] = useState<CustomForm | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [generatingQR, setGeneratingQR] = useState(false);
  const [selectedFormForQR, setSelectedFormForQR] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [currentQRCode, setCurrentQRCode] = useState<string>('');
  const [currentFormTitle, setCurrentFormTitle] = useState<string>('');
  const [currentFormId, setCurrentFormId] = useState<string>('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [optionsText, setOptionsText] = useState<Record<number, string>>({});

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    template: 'custom' as FormTemplate,
    fields: [] as FormField[],
    published: false,
    allowMultipleSubmissions: true,
    requiresAuth: false,
    datasetEnabled: false,
    datasetId: '',
    autoCreateDataset: false
  });

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'customForms'));
      const formsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      }) as CustomForm[];
      
      formsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setForms(formsData);
    } catch (error) {
      console.error('Error fetching forms:', error);
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

  const handleTemplateSelect = (template: FormTemplate) => {
    const templateConfig = formTemplates[template];
    const fields: FormField[] = templateConfig.fields.map((field, index) => ({
      ...field,
      id: `field-${Date.now()}-${index}`
    }));

    setFormData({
      ...formData,
      template,
      fields,
      title: templateConfig.name,
      description: templateConfig.description,
      slug: generateSlug(templateConfig.name)
    });
    setShowTemplateSelector(false);
    setShowForm(true);
  };

  const handleAIFormGenerated = async (aiFormData: {
    title: string;
    description: string;
    fields: FormField[];
    published: boolean;
    purpose: string;
    outcomes: string;
  }) => {
    try {
      const slug = generateSlug(aiFormData.title);
      const publicUrl = generateFormPublicUrl('temp');
      
      const formDataToSave = {
        title: aiFormData.title,
        description: aiFormData.description,
        slug,
        template: 'custom' as FormTemplate,
        fields: aiFormData.fields,
        publicUrl,
        published: aiFormData.published,
        allowMultipleSubmissions: true,
        requiresAuth: false,
        submissionCount: 0,
        aiGenerated: true,
        purpose: aiFormData.purpose,
        outcomes: aiFormData.outcomes,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date())
      };

      const docRef = await addDoc(collection(db, 'customForms'), formDataToSave);
      
      // Update with correct public URL
      const correctPublicUrl = generateFormPublicUrl(docRef.id);
      await updateDoc(doc(db, 'customForms', docRef.id), {
        publicUrl: correctPublicUrl
      });

      // Auto-generate QR code
      await handleGenerateQR(docRef.id);
      
      fetchForms();
      alert('AI-generated form created successfully!');
    } catch (error) {
      console.error('Error saving AI-generated form:', error);
      alert('Error saving form. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const publicUrl = generateFormPublicUrl(editingForm?.id || 'temp');
      
      let formId = editingForm?.id;
      
      // Save or update the form first
      if (editingForm) {
        // Update existing form
        await updateDoc(doc(db, 'customForms', editingForm.id), {
          title: formData.title,
          description: formData.description,
          slug: formData.slug || generateSlug(formData.title),
          template: formData.template,
          fields: formData.fields,
          publicUrl,
          published: formData.published,
          allowMultipleSubmissions: formData.allowMultipleSubmissions,
          requiresAuth: formData.requiresAuth,
          updatedAt: Timestamp.fromDate(new Date())
        });
        console.log('✅ Form updated:', editingForm.id);
      } else {
        // Create new form
        const docRef = await addDoc(collection(db, 'customForms'), {
          title: formData.title,
          description: formData.description,
          slug: formData.slug || generateSlug(formData.title),
          template: formData.template,
          fields: formData.fields,
          publicUrl,
          published: formData.published,
          allowMultipleSubmissions: formData.allowMultipleSubmissions,
          requiresAuth: formData.requiresAuth,
          submissionCount: 0,
          createdAt: Timestamp.fromDate(new Date()),
          updatedAt: Timestamp.fromDate(new Date())
        });
        
        formId = docRef.id;
        
        // Update with correct public URL
        const correctPublicUrl = generateFormPublicUrl(docRef.id);
        await updateDoc(doc(db, 'customForms', docRef.id), {
          publicUrl: correctPublicUrl
        });
        console.log('✅ Form created:', docRef.id);
      }

      // Auto-create dataset if form has fields
      if (formId && formData.fields.length > 0) {
        try {
          console.log('🔄 Auto-creating dataset for form:', formId);
          const datasetId = await ensureDatasetForForm(
            formId,
            formData.title,
            formData.fields
          );
          console.log('✅ Dataset ensured:', datasetId);
          alert(`Form saved successfully! Dataset ${datasetId} is linked.`);
        } catch (datasetError) {
          console.error('⚠️ Error creating dataset:', datasetError);
          alert('Form saved, but there was an error creating the dataset. The dataset will be created on first submission.');
        }
      } else {
        alert('Form saved successfully!');
      }

      resetForm();
      fetchForms();
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Error saving form. Please try again.');
    }
  };

  const handleEdit = (form: CustomForm) => {
    setEditingForm(form);
    setFormData({
      title: form.title,
      description: form.description,
      slug: form.slug,
      template: (form.template as FormTemplate) || 'custom',
      fields: form.fields as FormField[],
      published: form.published,
      allowMultipleSubmissions: form.allowMultipleSubmissions,
      requiresAuth: form.requiresAuth,
      datasetEnabled: (form as any).datasetEnabled || false,
      datasetId: (form as any).datasetId || '',
      autoCreateDataset: false
    });
    setShowForm(true);
  };

  const handleDuplicate = async (form: CustomForm) => {
    try {
      const newTitle = `${form.title} (Copy)`;
      const publicUrl = generateFormPublicUrl('temp');
      
      const docRef = await addDoc(collection(db, 'customForms'), {
        title: newTitle,
        description: form.description,
        slug: generateSlug(newTitle),
        template: form.template,
        fields: form.fields,
        publicUrl,
        published: false,
        allowMultipleSubmissions: form.allowMultipleSubmissions,
        requiresAuth: form.requiresAuth,
        submissionCount: 0,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date())
      });

      const correctPublicUrl = generateFormPublicUrl(docRef.id);
      await updateDoc(doc(db, 'customForms', docRef.id), {
        publicUrl: correctPublicUrl
      });

      fetchForms();
    } catch (error) {
      console.error('Error duplicating form:', error);
      alert('Error duplicating form. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Check if form has a linked dataset
      const datasetId = await getDatasetForForm(id);
      
      let deleteDatasetToo = false;
      if (datasetId) {
        const stats = await getDatasetStats(datasetId);
        const recordCount = stats?.recordCount || 0;
        
        // Show custom confirmation dialog for dataset deletion
        const confirmMessage = `This form has a linked dataset with ${recordCount} record(s).\n\nDo you want to delete the dataset as well?\n\n- Click OK to delete BOTH the form AND the dataset\n- Click Cancel to delete ONLY the form (dataset will be preserved)`;
        deleteDatasetToo = confirm(confirmMessage);
      }
      
      // Final confirmation for form deletion
      if (!confirm('Are you sure you want to delete this form? This will also delete all submissions.')) {
        return;
      }
      
      // Delete the form
      await deleteDoc(doc(db, 'customForms', id));
      
      // Delete all submissions for this form
      const submissionsQuery = query(collection(db, 'formSubmissions'), where('formId', '==', id));
      const submissionsSnapshot = await getDocs(submissionsQuery);
      const deletePromises = submissionsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      // Handle dataset deletion or unlinking
      if (datasetId) {
        if (deleteDatasetToo) {
          await deleteDataset(datasetId);
          alert('Form, submissions, and dataset deleted successfully.');
        } else {
          await unlinkFormFromDataset(id);
          alert('Form and submissions deleted. Dataset preserved.');
        }
      } else {
        alert('Form and submissions deleted successfully.');
      }
      
      fetchForms();
    } catch (error) {
      console.error('Error deleting form:', error);
      alert('Error deleting form. Please try again.');
    }
  };

  const handleGenerateQR = async (formId: string) => {
    setGeneratingQR(true);
    setSelectedFormForQR(formId);
    try {
      const form = forms.find(f => f.id === formId);
      if (!form) {
        throw new Error('Form not found');
      }
      
      const qrCode = await generateFormQRCode(formId);
      await updateDoc(doc(db, 'customForms', formId), {
        qrCode,
        updatedAt: Timestamp.fromDate(new Date())
      });
      
      // Show the QR code in a modal
      setCurrentQRCode(qrCode);
      setCurrentFormTitle(form.title);
      setCurrentFormId(formId);
      setLinkCopied(false);
      setShowQRModal(true);
      
      fetchForms();
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Error generating QR code. Please try again.');
    } finally {
      setGeneratingQR(false);
      setSelectedFormForQR(null);
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = currentQRCode;
    link.download = `${currentFormTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPaperForm = (form: CustomForm) => {
    try {
      downloadPaperFormPDF({
        formId: form.id,
        title: form.title,
        description: form.description,
        fields: form.fields as FormField[],
        publicUrl: form.publicUrl,
        qrCode: form.qrCode
      });
    } catch (error) {
      console.error('Error generating paper form:', error);
      alert('Error generating paper form. Please try again.');
    }
  };

  const handleDownloadSurveyPoster = async (form: CustomForm) => {
    try {
      await downloadSurveyPoster(form.id, form.title, form.qrCode);
    } catch (error) {
      console.error('Error generating survey poster:', error);
      alert('Error generating survey poster. Please try again.');
    }
  };

  const copyFormLink = () => {
    const formUrl = generateFormPublicUrl(currentFormId);
    navigator.clipboard.writeText(formUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy link:', err);
      alert('Failed to copy link to clipboard');
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      slug: '',
      template: 'custom',
      fields: [],
      published: false,
      allowMultipleSubmissions: true,
      requiresAuth: false,
      datasetEnabled: false,
      datasetId: '',
      autoCreateDataset: false
    });
    setEditingForm(null);
    setShowForm(false);
    setOptionsText({});
  };

  const addField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      label: '',
      type: 'text',
      required: false,
      order: formData.fields.length
    };
    setFormData({ ...formData, fields: [...formData.fields, newField] });
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const newFields = [...formData.fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFormData({ ...formData, fields: newFields });
  };

  const removeField = (index: number) => {
    const newFields = formData.fields.filter((_, i) => i !== index);
    setFormData({ ...formData, fields: newFields });
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...formData.fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newFields.length) return;
    
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    newFields.forEach((field, i) => field.order = i);
    
    setFormData({ ...formData, fields: newFields });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Custom Forms Management</h1>
        <button
          onClick={() => setShowTemplateSelector(true)}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
        >
          Create New Form
        </button>
      </div>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Select a Template</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {Object.entries(formTemplates).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => handleTemplateSelect(key as FormTemplate)}
                  className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                  {template.fields.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">{template.fields.length} fields</p>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowTemplateSelector(false)}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Form Editor */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            {editingForm ? 'Edit Form' : 'Create New Form'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Form Title</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                required
              />
            </div>

            {/* Form Fields */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Form Fields</h3>
                <button
                  type="button"
                  onClick={addField}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                >
                  + Add Field
                </button>
              </div>

              <div className="space-y-4">
                {formData.fields.map((field, index) => (
                  <div key={field.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Field Label</label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => updateField(index, { label: e.target.value })}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-gray-900"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Field Type</label>
                        <select
                          value={field.type}
                          onChange={(e) => updateField(index, { type: e.target.value as any })}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-gray-900"
                        >
                          <option value="text">Text</option>
                          <option value="email">Email</option>
                          <option value="phone">Phone</option>
                          <option value="textarea">Textarea</option>
                          <option value="number">Number</option>
                          <option value="date">Date</option>
                          <option value="select">Select</option>
                          <option value="radio">Radio</option>
                          <option value="checkbox">Checkbox</option>
                          <option value="file">File</option>
                        </select>
                      </div>
                    </div>

                    {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Options (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={optionsText[index] !== undefined ? optionsText[index] : (field.options?.join(', ') || '')}
                          onChange={(e) => {
                            setOptionsText(prev => ({ ...prev, [index]: e.target.value }));
                          }}
                          onBlur={(e) => {
                            const options = e.target.value.split(',').map(o => o.trim()).filter(o => o);
                            updateField(index, { options });
                            setOptionsText(prev => {
                              const newState = { ...prev };
                              delete newState[index];
                              return newState;
                            });
                          }}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-gray-900"
                          placeholder="Option 1, Option 2, Option 3"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center text-xs text-gray-700">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateField(index, { required: e.target.checked })}
                            className="mr-1"
                          />
                          Required
                        </label>
                        <input
                          type="text"
                          value={field.placeholder || ''}
                          onChange={(e) => updateField(index, { placeholder: e.target.value })}
                          className="border border-gray-300 rounded px-2 py-1 text-xs text-gray-900"
                          placeholder="Placeholder text..."
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => moveField(index, 'up')}
                          disabled={index === 0}
                          className="text-gray-600 hover:text-gray-800 disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveField(index, 'down')}
                          disabled={index === formData.fields.length - 1}
                          className="text-gray-600 hover:text-gray-800 disabled:opacity-30"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removeField(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {formData.fields.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No fields yet. Click "Add Field" to create your first field.
                  </p>
                )}
              </div>
            </div>

            {/* Form Settings */}
            <div className="border-t pt-6 space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Form Settings</h3>
              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="mr-2"
                />
                Published (visible to public)
              </label>
              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.allowMultipleSubmissions}
                  onChange={(e) => setFormData({ ...formData, allowMultipleSubmissions: e.target.checked })}
                  className="mr-2"
                />
                Allow multiple submissions from same user
              </label>
              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.requiresAuth}
                  onChange={(e) => setFormData({ ...formData, requiresAuth: e.target.checked })}
                  className="mr-2"
                />
                Require authentication to submit
              </label>
            </div>

            {/* Dataset Integration Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-sm">NEW</span>
                DataHub Integration
              </h3>
              <div className="space-y-4">
                <label className="flex items-start text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.datasetEnabled}
                    onChange={(e) => setFormData({ ...formData, datasetEnabled: e.target.checked })}
                    className="mr-2 mt-1"
                  />
                  <div>
                    <span className="font-medium">Send submissions to DataHub</span>
                    <p className="text-sm text-gray-500 mt-1">
                      Automatically store form submissions in a dataset for advanced analytics and reporting
                    </p>
                  </div>
                </label>

                {formData.datasetEnabled && (
                  <div className="ml-6 space-y-3 bg-purple-50 p-4 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dataset ID
                      </label>
                      <input
                        type="text"
                        value={formData.datasetId}
                        onChange={(e) => setFormData({ ...formData, datasetId: e.target.value })}
                        placeholder="Enter existing dataset ID or leave blank to create new"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Find dataset IDs in <Link href="/admin/datasets" className="text-primary hover:underline">DataHub Admin</Link>
                      </p>
                    </div>

                    <label className="flex items-center text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={formData.autoCreateDataset}
                        onChange={(e) => setFormData({ ...formData, autoCreateDataset: e.target.checked })}
                        className="mr-2"
                      />
                      Auto-create dataset if it doesn't exist
                    </label>

                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <p className="text-xs text-blue-800">
                        <strong>💡 Tip:</strong> Create a dataset first in DataHub Admin with matching fields, 
                        then enter its ID here for automatic data sync.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
              >
                {editingForm ? 'Update Form' : 'Create Form'}
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

      {/* Forms List - Table View */}
      {forms.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
          No forms yet. Click "Create New Form" to get started.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {forms.map((form) => (
                <tr key={form.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{form.title}</div>
                    <div className="text-sm text-gray-500">{form.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${form.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {form.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link href={`/admin/forms/submissions/${form.id}`} className="text-primary hover:underline">
                      {form.submissionCount || 0} submissions
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button onClick={() => handleEdit(form)} className="text-primary hover:text-primary/80">Edit</button>
                    <button onClick={() => handleDuplicate(form)} className="text-blue-600 hover:text-blue-800">Duplicate</button>
                    <button onClick={() => handleGenerateQR(form.id)} className="text-green-600 hover:text-green-800" disabled={generatingQR && selectedFormForQR === form.id}>
                      {generatingQR && selectedFormForQR === form.id ? 'Generating...' : 'QR Code'}
                    </button>
                    <button onClick={() => handleDownloadPaperForm(form)} className="text-purple-600 hover:text-purple-800">
                      Paper Form
                    </button>
                    <button onClick={() => handleDownloadSurveyPoster(form)} className="text-orange-600 hover:text-orange-800">
                      Survey Poster
                    </button>
                    <button onClick={() => handleDelete(form.id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowQRModal(false)}>
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">QR Code for {currentFormTitle}</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-6">
                <img src={currentQRCode} alt="QR Code" className="w-64 h-64" />
              </div>
              
              <p className="text-sm text-gray-600 text-center mb-4">
                Scan this QR code to access the form directly
              </p>
              
              {/* Form Link Display */}
              <div className="w-full bg-gray-50 rounded-lg p-3 mb-6 border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Form Link:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={generateFormPublicUrl(currentFormId)}
                    readOnly
                    className="flex-1 text-sm bg-white border border-gray-300 rounded px-3 py-2 text-gray-700"
                  />
                  <button
                    onClick={copyFormLink}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium whitespace-nowrap"
                  >
                    {linkCopied ? '✓ Copied!' : 'Copy Link'}
                  </button>
                </div>
              </div>
              
              <div className="flex gap-3 w-full">
                <button
                  onClick={downloadQRCode}
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 font-medium"
                >
                  Download QR Code
                </button>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormsPage;
