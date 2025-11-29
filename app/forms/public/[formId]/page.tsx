'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, addDoc, collection, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CustomForm, FormSubmission } from '@/lib/firestore-schema';
import { FormField } from '@/types/form';
import { useParams } from 'next/navigation';
import FormBrandingHeader, { FormBrandingFooter } from '@/components/FormBranding/FormBrandingHeader';
import { captureFormTrackingData } from '@/lib/formTracking';
import { ensureDatasetForForm } from '@/lib/datahub-service';

export default function PublicFormPage() {
  const params = useParams();
  const formId = params.formId as string;
  
  const [form, setForm] = useState<CustomForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchForm();
  }, [formId]);

  const fetchForm = async () => {
    try {
      const formDoc = await getDoc(doc(db, 'customForms', formId));
      
      if (!formDoc.exists()) {
        setError('Form not found');
        setLoading(false);
        return;
      }

      const formData = {
        id: formDoc.id,
        ...formDoc.data(),
        createdAt: formDoc.data().createdAt?.toDate() || new Date(),
        updatedAt: formDoc.data().updatedAt?.toDate() || new Date(),
      } as CustomForm;

      if (!formData.published) {
        setError('This form is not currently accepting submissions');
        setLoading(false);
        return;
      }

      setForm(formData);
      
      // Initialize form data with empty values
      const initialData: Record<string, any> = {};
      formData.fields.forEach((field: any) => {
        initialData[field.id] = field.type === 'checkbox' ? [] : '';
      });
      setFormData(initialData);
    } catch (err) {
      console.error('Error fetching form:', err);
      setError('Error loading form');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleCheckboxChange = (fieldId: string, option: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = prev[fieldId] || [];
      if (checked) {
        return { ...prev, [fieldId]: [...currentValues, option] };
      } else {
        return { ...prev, [fieldId]: currentValues.filter((v: string) => v !== option) };
      }
    });
  };

  const validateForm = (): boolean => {
    if (!form) return false;

    for (const field of form.fields as FormField[]) {
      if (field.required) {
        const value = formData[field.id];
        if (!value || (Array.isArray(value) && value.length === 0)) {
          alert(`Please fill in the required field: ${field.label}`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // Capture tracking data
      const trackingData = await captureFormTrackingData();
      
      // Ensure dataset exists for this form (auto-create if needed)
      let datasetId: string | null = null;
      try {
        datasetId = await ensureDatasetForForm(
          form!.id,
          form!.title,
          form!.fields as FormField[]
        );
        console.log('✅ Dataset ensured:', datasetId);
      } catch (datasetError) {
        console.error('⚠️ Error ensuring dataset:', datasetError);
        // Continue with form submission even if dataset creation fails
      }
      
      // Create submission with tracking data
      const submission: Omit<FormSubmission, 'id'> = {
        formId: form!.id,
        formTitle: form!.title,
        data: formData,
        submittedAt: new Date(),
        trackingData: trackingData as any, // Add tracking data
      };

      const submissionDoc = await addDoc(collection(db, 'formSubmissions'), {
        ...submission,
        submittedAt: Timestamp.fromDate(submission.submittedAt)
      });

      // Update submission count
      const formRef = doc(db, 'customForms', form!.id);
      const formDoc = await getDoc(formRef);
      const currentCount = formDoc.data()?.submissionCount || 0;
      
      await updateDoc(formRef, {
        submissionCount: currentCount + 1
      });

      // Send to dataset if we have a datasetId
      if (datasetId) {
        try {
          await fetch(`/api/datasets/${datasetId}/records`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              data: formData,
              metadata: {
                sourceFormSubmissionId: submissionDoc.id,
                sourceApplication: 'LeadershipConnections',
                submittedBy: submission.submittedBy,
                submittedAt: new Date(),
                deviceType: trackingData.deviceType,
                userAgent: trackingData.userAgent,
                location: trackingData.approximateLocation,
              }
            })
          });
          console.log('✅ Data sent to dataset:', datasetId);
        } catch (datasetError) {
          console.error('⚠️ Error sending to dataset:', datasetError);
          // Don't fail the form submission if dataset sync fails
        }
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Error submitting form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const commonClasses = "w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent";

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <input
            type={field.type}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={commonClasses}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            min={field.validation?.min}
            max={field.validation?.max}
            className={commonClasses}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            className={commonClasses}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
            className={commonClasses}
          />
        );

      case 'select':
        return (
          <select
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            className={commonClasses}
          >
            <option value="">Select an option...</option>
            {field.options?.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <label key={idx} className="flex items-center text-gray-700">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={formData[field.id] === option}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <label key={idx} className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  checked={(formData[field.id] || []).includes(option)}
                  onChange={(e) => handleCheckboxChange(field.id, option, e.target.checked)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        );

      case 'file':
        return (
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleInputChange(field.id, file.name);
              }
            }}
            required={field.required}
            className={commonClasses}
          />
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-gray-600 mb-6">Your submission has been received successfully.</p>
          {form?.allowMultipleSubmissions && (
            <button
              onClick={() => {
                setSubmitted(false);
                const initialData: Record<string, any> = {};
                form.fields.forEach((field: any) => {
                  initialData[field.id] = field.type === 'checkbox' ? [] : '';
                });
                setFormData(initialData);
              }}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
            >
              Submit Another Response
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Branding Header */}
      <FormBrandingHeader variant="compact" showTagline={true} />
      
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{form?.title}</h1>
              <p className="text-gray-600">{form?.description}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {(form?.fields as FormField[])?.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(field)}
                </div>
              ))}

              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Branding Footer */}
      <FormBrandingFooter />
    </div>
  );
}
