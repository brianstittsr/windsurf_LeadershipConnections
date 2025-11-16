'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  program: string;
  otherProgram?: string;
  message: string;
  status: 'new' | 'reviewed' | 'responded';
  createdAt: any;
}

const ContactSubmissionsPage = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const adminEmails = [
    'brianstittsr@gmail.com',
    'kathy@ncleadconnect.org',
    'gloria@ncleadconnect.org'
  ];

  useEffect(() => {
    if (!user) {
      router.push('/signin');
      return;
    }

    if (!adminEmails.includes(user.email || '')) {
      router.push('/');
      return;
    }

    fetchSubmissions();
  }, [user, router]);

  const fetchSubmissions = async () => {
    try {
      const q = query(collection(db, 'contactSubmissions'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const submissionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContactSubmission[];
      setSubmissions(submissionsData);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'new' | 'reviewed' | 'responded') => {
    try {
      await updateDoc(doc(db, 'contactSubmissions', id), { status });
      setSubmissions(prev => prev.map(sub => 
        sub.id === id ? { ...sub, status } : sub
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteSubmission = async (id: string) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      try {
        await deleteDoc(doc(db, 'contactSubmissions', id));
        setSubmissions(prev => prev.filter(sub => sub.id !== id));
        setSelectedSubmission(null);
      } catch (error) {
        console.error('Error deleting submission:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'responded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
          <p className="text-gray-600 mt-2">Manage contact form submissions from the website</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submissions List */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">All Submissions ({submissions.length})</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {submissions.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No submissions yet
                </div>
              ) : (
                submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedSubmission?.id === submission.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{submission.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                        {submission.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{submission.email}</p>
                    <p className="text-sm text-gray-500">
                      {submission.program === 'Other' ? `${submission.program} (${submission.otherProgram})` : submission.program}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(submission.createdAt)}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Submission Details */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Submission Details</h2>
            </div>
            {selectedSubmission ? (
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-gray-900">{selectedSubmission.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">
                      <a href={`mailto:${selectedSubmission.email}`} className="text-blue-600 hover:underline">
                        {selectedSubmission.email}
                      </a>
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Program of Interest</label>
                    <p className="text-gray-900">
                      {selectedSubmission.program === 'Other' 
                        ? `${selectedSubmission.program} (${selectedSubmission.otherProgram})` 
                        : selectedSubmission.program}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Message</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedSubmission.message}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Submitted</label>
                    <p className="text-gray-900">{formatDate(selectedSubmission.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={selectedSubmission.status}
                      onChange={(e) => updateStatus(selectedSubmission.id, e.target.value as any)}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    >
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="responded">Responded</option>
                    </select>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => deleteSubmission(selectedSubmission.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                Select a submission to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSubmissionsPage;
