'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { JobPosting, JobType, JobLocation, ExperienceLevel, JOB_TYPES, JOB_LOCATIONS, EXPERIENCE_LEVELS, JOB_CATEGORIES } from '@/types/job.types';
import { FaBriefcase, FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaMapMarkerAlt, FaClock, FaDollarSign } from 'react-icons/fa';

export default function JobsManagementPage() {
  const { user, userRole, hasPermission } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  
  const [formData, setFormData] = useState<{
    title: string;
    company: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
    jobType: JobType;
    location: JobLocation;
    city: string;
    state: string;
    experienceLevel: ExperienceLevel;
    salaryRange: { min: number; max: number; currency: string };
    industry: string;
    category: string;
    skills: string[];
    applicationUrl: string;
    applicationEmail: string;
    applicationInstructions: string;
    status: 'active' | 'closed' | 'draft';
    featured: boolean;
  }>({
    title: '',
    company: '',
    description: '',
    requirements: [''],
    responsibilities: [''],
    jobType: 'full-time',
    location: 'on-site',
    city: '',
    state: '',
    experienceLevel: 'mid',
    salaryRange: { min: 0, max: 0, currency: 'USD' },
    industry: '',
    category: '',
    skills: [''],
    applicationUrl: '',
    applicationEmail: '',
    applicationInstructions: '',
    status: 'active',
    featured: false,
  });

  useEffect(() => {
    // Check if user has permission to manage jobs
    if (!hasPermission('canManageUsers')) {
      router.push('/admin/dashboard');
      return;
    }
    fetchJobs();
  }, [hasPermission, router]);

  const fetchJobs = async () => {
    try {
      const q = query(collection(db, 'jobPostings'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const jobsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          expiresAt: data.expiresAt?.toDate(),
        } as JobPosting;
      });
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      const jobData = {
        ...formData,
        requirements: formData.requirements.filter(r => r.trim()),
        responsibilities: formData.responsibilities.filter(r => r.trim()),
        skills: formData.skills.filter(s => s.trim()),
        postedBy: user.uid,
        postedByName: user.displayName || user.email || 'Unknown',
        postedByEmail: user.email || '',
        viewCount: 0,
        applicationCount: 0,
        referralCount: 0,
        updatedAt: Timestamp.now(),
      };

      if (editingJob) {
        await updateDoc(doc(db, 'jobPostings', editingJob.id), jobData);
      } else {
        await addDoc(collection(db, 'jobPostings'), {
          ...jobData,
          createdAt: Timestamp.now(),
        });
      }

      resetForm();
      fetchJobs();
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Failed to save job posting');
    }
  };

  const handleEdit = (job: JobPosting) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      description: job.description,
      requirements: job.requirements.length > 0 ? job.requirements : [''],
      responsibilities: job.responsibilities.length > 0 ? job.responsibilities : [''],
      jobType: job.jobType,
      location: job.location,
      city: job.city || '',
      state: job.state || '',
      experienceLevel: job.experienceLevel,
      salaryRange: job.salaryRange || { min: 0, max: 0, currency: 'USD' },
      industry: job.industry || '',
      category: job.category,
      skills: job.skills.length > 0 ? job.skills : [''],
      applicationUrl: job.applicationUrl || '',
      applicationEmail: job.applicationEmail || '',
      applicationInstructions: job.applicationInstructions || '',
      status: job.status,
      featured: job.featured,
    });
    setShowForm(true);
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    
    try {
      await deleteDoc(doc(db, 'jobPostings', jobId));
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job posting');
    }
  };

  const handleToggleStatus = async (job: JobPosting) => {
    try {
      const newStatus = job.status === 'active' ? 'closed' : 'active';
      await updateDoc(doc(db, 'jobPostings', job.id), {
        status: newStatus,
        updatedAt: Timestamp.now(),
      });
      fetchJobs();
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      description: '',
      requirements: [''],
      responsibilities: [''],
      jobType: 'full-time',
      location: 'on-site',
      city: '',
      state: '',
      experienceLevel: 'mid',
      salaryRange: { min: 0, max: 0, currency: 'USD' },
      industry: '',
      category: '',
      skills: [''],
      applicationUrl: '',
      applicationEmail: '',
      applicationInstructions: '',
      status: 'active',
      featured: false,
    });
    setEditingJob(null);
    setShowForm(false);
  };

  const addArrayField = (field: 'requirements' | 'responsibilities' | 'skills') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const updateArrayField = (field: 'requirements' | 'responsibilities' | 'skills', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item),
    }));
  };

  const removeArrayField = (field: 'requirements' | 'responsibilities' | 'skills', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Postings</h1>
          <p className="text-gray-600">Manage job opportunities for LC Alumni</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <FaPlus />
          Post New Job
        </button>
      </div>

      {/* Job Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full my-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type *</label>
                  <select
                    value={formData.jobType}
                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    {JOB_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location Type *</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    {JOB_LOCATIONS.map(loc => (
                      <option key={loc.value} value={loc.value}>{loc.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level *</label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    {EXPERIENCE_LEVELS.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Category & Industry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Select a category</option>
                    {JOB_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Salary Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range (Optional)</label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Min"
                    value={formData.salaryRange.min || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      salaryRange: { ...formData.salaryRange, min: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={formData.salaryRange.max || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      salaryRange: { ...formData.salaryRange, max: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => updateArrayField('requirements', index, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Enter a requirement"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField('requirements', index)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('requirements')}
                  className="text-primary hover:underline text-sm"
                >
                  + Add Requirement
                </button>
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Responsibilities</label>
                {formData.responsibilities.map((resp, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={resp}
                      onChange={(e) => updateArrayField('responsibilities', index, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Enter a responsibility"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField('responsibilities', index)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('responsibilities')}
                  className="text-primary hover:underline text-sm"
                >
                  + Add Responsibility
                </button>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => updateArrayField('skills', index, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Enter a skill"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField('skills', index)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('skills')}
                  className="text-primary hover:underline text-sm"
                >
                  + Add Skill
                </button>
              </div>

              {/* Application Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Application URL</label>
                  <input
                    type="url"
                    value={formData.applicationUrl}
                    onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Application Email</label>
                  <input
                    type="email"
                    value={formData.applicationEmail}
                    onChange={(e) => setFormData({ ...formData, applicationEmail: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Application Instructions</label>
                  <textarea
                    value={formData.applicationInstructions}
                    onChange={(e) => setFormData({ ...formData, applicationInstructions: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Status & Featured */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured Job</span>
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90"
                >
                  {editingJob ? 'Update Job' : 'Post Job'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                  {job.featured && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded ${
                    job.status === 'active' ? 'bg-green-100 text-green-800' :
                    job.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {job.status}
                  </span>
                </div>
                <p className="text-lg text-gray-700 mb-2">{job.company}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <FaBriefcase />
                    {JOB_TYPES.find(t => t.value === job.jobType)?.label}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaMapMarkerAlt />
                    {JOB_LOCATIONS.find(l => l.value === job.location)?.label}
                    {job.city && ` - ${job.city}, ${job.state}`}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaClock />
                    {EXPERIENCE_LEVELS.find(e => e.value === job.experienceLevel)?.label}
                  </span>
                  {job.salaryRange && job.salaryRange.min > 0 && (
                    <span className="flex items-center gap-1">
                      <FaDollarSign />
                      ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleStatus(job)}
                  className="p-2 text-gray-600 hover:text-gray-900"
                  title={job.status === 'active' ? 'Close job' : 'Activate job'}
                >
                  {job.status === 'active' ? <FaEyeSlash /> : <FaEye />}
                </button>
                <button
                  onClick={() => handleEdit(job)}
                  className="p-2 text-blue-600 hover:text-blue-800"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <p className="text-gray-700 mb-3">{job.description.substring(0, 200)}...</p>
            <div className="flex flex-wrap gap-2">
              {job.skills.slice(0, 5).map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t text-sm text-gray-500">
              Posted by {job.postedByName} • {job.viewCount} views • {job.referralCount} referrals
            </div>
          </div>
        ))}

        {jobs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No job postings yet. Click "Post New Job" to create your first posting.
          </div>
        )}
      </div>
    </div>
  );
}
