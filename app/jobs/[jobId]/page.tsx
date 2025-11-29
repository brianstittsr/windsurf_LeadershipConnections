'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, increment, collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { JobPosting, JobReferral, JOB_TYPES, JOB_LOCATIONS, EXPERIENCE_LEVELS } from '@/types/job.types';
import { MemberProfile } from '@/types/member-profile.types';
import { FaArrowLeft, FaBriefcase, FaMapMarkerAlt, FaClock, FaDollarSign, FaBuilding, FaExternalLinkAlt, FaEnvelope, FaUserFriends } from 'react-icons/fa';
import Link from 'next/link';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const jobId = params.jobId as string;
  
  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [referralMessage, setReferralMessage] = useState('');
  const [sendingReferral, setSendingReferral] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchJob();
      fetchMembers();
    }
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const jobRef = doc(db, 'jobPostings', jobId);
      const jobSnap = await getDoc(jobRef);

      if (jobSnap.exists()) {
        const data = jobSnap.data();
        setJob({
          id: jobSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          expiresAt: data.expiresAt?.toDate(),
        } as JobPosting);

        // Increment view count
        await updateDoc(jobRef, {
          viewCount: increment(1)
        });
      }
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    if (!user) return;
    
    try {
      const q = query(
        collection(db, 'memberProfiles'),
        where('includeInDirectory', '==', true)
      );
      const querySnapshot = await getDocs(q);
      const membersData = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as MemberProfile))
        .filter(m => m.userId !== user.uid); // Don't show current user
      
      setMembers(membersData);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleSendReferral = async () => {
    if (!user || !job || !selectedMember) return;

    setSendingReferral(true);
    try {
      const selectedMemberProfile = members.find(m => m.userId === selectedMember);
      if (!selectedMemberProfile) return;

      const referralData: Omit<JobReferral, 'id'> = {
        jobId: job.id,
        jobTitle: job.title,
        referredBy: user.uid,
        referredByName: user.displayName || user.email || 'Unknown',
        referredTo: selectedMember,
        referredToName: `${selectedMemberProfile.firstName} ${selectedMemberProfile.lastName}`,
        referredToEmail: selectedMemberProfile.email,
        message: referralMessage,
        status: 'pending',
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'jobReferrals'), {
        ...referralData,
        createdAt: Timestamp.now(),
      });

      // Increment referral count on job
      await updateDoc(doc(db, 'jobPostings', job.id), {
        referralCount: increment(1)
      });

      alert('Referral sent successfully!');
      setShowReferralModal(false);
      setSelectedMember('');
      setReferralMessage('');
    } catch (error) {
      console.error('Error sending referral:', error);
      alert('Failed to send referral');
    } finally {
      setSendingReferral(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-900 mb-2">Job Not Found</h2>
          <p className="text-red-700 mb-4">This job posting may have been removed or is no longer available.</p>
          <Link href="/jobs" className="inline-flex items-center gap-2 text-primary hover:underline">
            <FaArrowLeft />
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/jobs" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <FaArrowLeft />
          Back to Jobs
        </Link>

        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-xl text-gray-700 flex items-center gap-2 mb-4">
                <FaBuilding className="text-gray-400" />
                {job.company}
              </p>
            </div>
            {job.featured && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded font-semibold">
                ⭐ Featured
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
            <span className="flex items-center gap-2">
              <FaBriefcase />
              {JOB_TYPES.find(t => t.value === job.jobType)?.label}
            </span>
            <span className="flex items-center gap-2">
              <FaMapMarkerAlt />
              {JOB_LOCATIONS.find(l => l.value === job.location)?.label}
              {job.city && ` - ${job.city}, ${job.state}`}
            </span>
            <span className="flex items-center gap-2">
              <FaClock />
              {EXPERIENCE_LEVELS.find(e => e.value === job.experienceLevel)?.label}
            </span>
            {job.salaryRange && job.salaryRange.min > 0 && (
              <span className="flex items-center gap-2">
                <FaDollarSign />
                ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex gap-3">
            {job.applicationUrl && (
              <a
                href={job.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 text-center flex items-center justify-center gap-2"
              >
                Apply Now
                <FaExternalLinkAlt />
              </a>
            )}
            {job.applicationEmail && !job.applicationUrl && (
              <a
                href={`mailto:${job.applicationEmail}`}
                className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 text-center flex items-center justify-center gap-2"
              >
                <FaEnvelope />
                Email Application
              </a>
            )}
            <button
              onClick={() => setShowReferralModal(true)}
              className="px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 flex items-center gap-2"
            >
              <FaUserFriends />
              Refer a Friend
            </button>
          </div>
        </div>

        {/* Job Details */}
        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          {/* Description */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Role</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {job.responsibilities.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {job.skills.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Application Instructions */}
          {job.applicationInstructions && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Apply</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{job.applicationInstructions}</p>
            </div>
          )}

          {/* Stats */}
          <div className="pt-6 border-t text-sm text-gray-500">
            Posted by {job.postedByName} • {job.viewCount} views • {job.referralCount} referrals
          </div>
        </div>
      </div>

      {/* Referral Modal */}
      {showReferralModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Refer an LC Alumni</h3>
            
            {!user ? (
              <div>
                <p className="text-gray-600 mb-4">Please log in to refer a friend to this job.</p>
                <button
                  onClick={() => router.push('/login')}
                  className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
                >
                  Log In
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Alumni Member
                  </label>
                  <select
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Choose a member...</option>
                    {members.map(member => (
                      <option key={member.userId} value={member.userId}>
                        {member.firstName} {member.lastName} - {member.currentTitle || 'LC Alumni'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    value={referralMessage}
                    onChange={(e) => setReferralMessage(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Add a personal note about why you think they'd be a great fit..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSendReferral}
                    disabled={!selectedMember || sendingReferral}
                    className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
                  >
                    {sendingReferral ? 'Sending...' : 'Send Referral'}
                  </button>
                  <button
                    onClick={() => {
                      setShowReferralModal(false);
                      setSelectedMember('');
                      setReferralMessage('');
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
