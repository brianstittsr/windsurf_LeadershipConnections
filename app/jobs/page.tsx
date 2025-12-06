'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { JobPosting, JOB_TYPES, JOB_LOCATIONS, EXPERIENCE_LEVELS, JOB_CATEGORIES } from '@/types/job.types';
import { FaBriefcase, FaMapMarkerAlt, FaClock, FaDollarSign, FaBuilding, FaFilter, FaUserFriends } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function JobsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [showReferralModal, setShowReferralModal] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    jobType: '',
    location: '',
    experienceLevel: '',
    category: '',
    search: '',
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, filters]);

  const fetchJobs = async () => {
    // Skip Firestore fetch if db is not available (e.g., during build)
    if (!db) {
      console.log('Firestore not available, skipping jobs fetch');
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'jobPostings'),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc'),
        limit(100)
      );
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

  const applyFilters = () => {
    let filtered = [...jobs];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.jobType) {
      filtered = filtered.filter(job => job.jobType === filters.jobType);
    }

    if (filters.location) {
      filtered = filtered.filter(job => job.location === filters.location);
    }

    if (filters.experienceLevel) {
      filtered = filtered.filter(job => job.experienceLevel === filters.experienceLevel);
    }

    if (filters.category) {
      filtered = filtered.filter(job => job.category === filters.category);
    }

    // Sort featured jobs first
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

    setFilteredJobs(filtered);
  };

  const handleReferFriend = (job: JobPosting) => {
    if (!user) {
      alert('Please log in to refer a friend');
      router.push('/login');
      return;
    }
    setSelectedJob(job);
    setShowReferralModal(true);
  };

  const getTimeSincePosted = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Job Board</h1>
          <p className="text-lg text-gray-600">Opportunities for Leadership Connections Alumni</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaFilter />
                Filters
              </h2>

              {/* Search */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Job title, company..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              {/* Job Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <select
                  value={filters.jobType}
                  onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">All Types</option>
                  {JOB_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">All Locations</option>
                  {JOB_LOCATIONS.map(loc => (
                    <option key={loc.value} value={loc.value}>{loc.label}</option>
                  ))}
                </select>
              </div>

              {/* Experience Level */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                <select
                  value={filters.experienceLevel}
                  onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">All Levels</option>
                  {EXPERIENCE_LEVELS.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">All Categories</option>
                  {JOB_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setFilters({ jobType: '', location: '', experienceLevel: '', category: '', search: '' })}
                className="w-full text-sm text-primary hover:underline"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Showing {filteredJobs.length} of {jobs.length} jobs
            </div>

            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                      {job.featured && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-semibold">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                    <p className="text-lg text-gray-700 mb-3 flex items-center gap-2">
                      <FaBuilding className="text-gray-400" />
                      {job.company}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">{getTimeSincePosted(job.createdAt)}</span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
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

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.slice(0, 5).map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 5 && (
                    <span className="text-xs text-gray-500">+{job.skills.length - 5} more</span>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 text-center"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleReferFriend(job)}
                    className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10"
                  >
                    <FaUserFriends />
                    Refer a Friend
                  </button>
                </div>
              </div>
            ))}

            {filteredJobs.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
                <button
                  onClick={() => setFilters({ jobType: '', location: '', experienceLevel: '', category: '', search: '' })}
                  className="mt-4 text-primary hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Referral Modal - Will be implemented in next step */}
      {showReferralModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Refer a Friend</h3>
            <p className="text-gray-600 mb-4">
              Job referral feature will be available soon with in-app messaging integration.
            </p>
            <button
              onClick={() => setShowReferralModal(false)}
              className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
