'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, getDoc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CustomForm, FormSubmission } from '@/lib/firestore-schema';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';

export default function FormSubmissionsPage() {
  const params = useParams();
  const formId = params.formId as string;
  
  const [form, setForm] = useState<CustomForm | null>(null);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);

  useEffect(() => {
    fetchFormAndSubmissions();
  }, [formId]);

  const fetchFormAndSubmissions = async () => {
    try {
      // Fetch form details
      const formDoc = await getDoc(doc(db, 'customForms', formId));
      if (formDoc.exists()) {
        const formData = {
          id: formDoc.id,
          ...formDoc.data(),
          createdAt: formDoc.data().createdAt?.toDate() || new Date(),
          updatedAt: formDoc.data().updatedAt?.toDate() || new Date(),
        } as CustomForm;
        setForm(formData);
      }

      // Fetch submissions
      const submissionsQuery = query(
        collection(db, 'formSubmissions'),
        where('formId', '==', formId),
        orderBy('submittedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(submissionsQuery);
      const submissionsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          submittedAt: data.submittedAt?.toDate() || new Date(),
        };
      }) as FormSubmission[];
      
      setSubmissions(submissionsData);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!form || submissions.length === 0) return;

    // Get all unique field keys
    const fieldKeys = new Set<string>();
    submissions.forEach(sub => {
      Object.keys(sub.data).forEach(key => fieldKeys.add(key));
    });

    // Create CSV header
    const headers = ['Submission ID', 'Submitted At', ...Array.from(fieldKeys)];
    const csvRows = [headers.join(',')];

    // Add data rows
    submissions.forEach(sub => {
      const row = [
        sub.id,
        format(new Date(sub.submittedAt), 'yyyy-MM-dd HH:mm:ss'),
        ...Array.from(fieldKeys).map(key => {
          const value = sub.data[key];
          if (Array.isArray(value)) {
            return `"${value.join(', ')}"`;
          }
          return `"${value || ''}"`;
        })
      ];
      csvRows.push(row.join(','));
    });

    // Download CSV
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.slug}-submissions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!form) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Form not found</p>
        <Link href="/admin/forms" className="text-primary hover:underline mt-4 inline-block">
          Back to Forms
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/forms" className="text-primary hover:underline mb-4 inline-block">
          ← Back to Forms
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>
            <p className="text-gray-600 mt-2">{submissions.length} total submissions</p>
          </div>
          <button
            onClick={exportToCSV}
            disabled={submissions.length === 0}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export to CSV
          </button>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No submissions yet for this form.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submission ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {submission.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {format(new Date(submission.submittedAt), 'PPP p')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="text-primary hover:text-primary/80"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedSubmission(null)}>
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Submission Details</h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-4 pb-4 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                Submitted: {format(new Date(selectedSubmission.submittedAt), 'PPP p')}
              </p>
              <p className="text-sm text-gray-600">
                ID: {selectedSubmission.id}
              </p>
            </div>

            <div className="space-y-4">
              {Object.entries(selectedSubmission.data).map(([key, value]) => {
                // Find the field label from form fields
                const field = (form.fields as any[]).find(f => f.id === key);
                const label = field?.label || key;

                return (
                  <div key={key} className="border-b border-gray-100 pb-3">
                    <p className="text-sm font-semibold text-gray-700 mb-1">{label}</p>
                    <p className="text-gray-900">
                      {Array.isArray(value) ? value.join(', ') : value?.toString() || 'N/A'}
                    </p>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setSelectedSubmission(null)}
              className="w-full mt-6 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
