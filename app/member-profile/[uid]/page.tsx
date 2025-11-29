'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MemberProfile } from '@/types/member-profile.types';
import { JobPosting } from '@/types/job.types';
import { FaArrowLeft, FaUser, FaBriefcase, FaMapMarkerAlt, FaEnvelope, FaPhone, FaLinkedin, FaGlobe, FaCalendar } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

export default function MemberProfileViewPage() {
  const params = useParams();
  const router = useRouter();
  const uid = params.uid as string;
  
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (uid) {
      fetchProfile();
      fetchUserJobs();
    }
  }, [uid]);

  const fetchProfile = async () => {
    try {
      const profileRef = doc(db, 'memberProfiles', uid);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        const data = profileSnap.data();
        setProfile({
          id: profileSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          lastActive: data.lastActive?.toDate() || new Date(),
        } as MemberProfile);
      } else {
        setError('Profile not found');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserJobs = async () => {
    try {
      const q = query(
        collection(db, 'jobPostings'),
        where('postedBy', '==', uid),
        where('status', '==', 'active')
      );
      const querySnapshot = await getDocs(q);
      const jobsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as JobPosting;
      });
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching user jobs:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-900 mb-2">Error</h2>
          <p className="text-red-700 mb-4">{error || 'Profile not found'}</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <FaArrowLeft />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <FaArrowLeft />
          Back
        </button>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-primary to-blue-600 h-32"></div>
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
            {/* Profile Photo */}
            <div className="relative">
              {profile.profilePhotoUrl ? (
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                  <Image
                    src={profile.profilePhotoUrl}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-300 flex items-center justify-center">
                  <FaUser className="text-gray-500 text-4xl" />
                </div>
              )}
            </div>

            {/* Name and Title */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profile.firstName} {profile.lastName}
              </h1>
              {profile.currentTitle && (
                <p className="text-xl text-gray-700 mb-1">{profile.currentTitle}</p>
              )}
              {profile.currentOrganization && (
                <p className="text-lg text-gray-600">{profile.currentOrganization}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          {profile.bio && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
            </div>
          )}

          {/* Professional Experience */}
          {profile.currentTitle && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaBriefcase className="text-primary" />
                Professional Experience
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{profile.currentTitle}</h3>
                  {profile.currentOrganization && (
                    <p className="text-gray-600">{profile.currentOrganization}</p>
                  )}
                  {profile.industry && (
                    <p className="text-sm text-gray-500 mt-1">Industry: {profile.industry}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Expertise */}
          {profile.expertise && profile.expertise.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Areas of Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {profile.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Leadership Programs */}
          {profile.programs && profile.programs.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Leadership Programs</h2>
              <div className="space-y-3">
                {profile.programs.map((program, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <FaCalendar className="text-primary flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">{program.name}</p>
                      <p className="text-sm text-gray-600">Class of {program.graduationYear}</p>
                      {program.location && (
                        <p className="text-xs text-gray-500">{program.location}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Job Postings */}
          {jobs.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaBriefcase className="text-primary" />
                Job Opportunities Posted
              </h2>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="block border border-gray-200 rounded-lg p-4 hover:border-primary hover:shadow-md transition-all"
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaMapMarkerAlt />
                        {job.city ? `${job.city}, ${job.state}` : job.location}
                      </span>
                      <span>{job.viewCount} views</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Contact & Details */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact</h2>
            <div className="space-y-3">
              {profile.email && (
                <div className="flex items-start gap-3">
                  <FaEnvelope className="text-gray-400 mt-1 flex-shrink-0" />
                  <a href={`mailto:${profile.email}`} className="text-primary hover:underline break-all">
                    {profile.email}
                  </a>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-start gap-3">
                  <FaPhone className="text-gray-400 mt-1 flex-shrink-0" />
                  <a href={`tel:${profile.phone}`} className="text-primary hover:underline">
                    {profile.phone}
                  </a>
                </div>
              )}
              {profile.city && profile.state && (
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-gray-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">
                    {profile.city}, {profile.state}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Social Links */}
          {(profile.linkedInUrl || profile.websiteUrl) && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Links</h2>
              <div className="space-y-3">
                {profile.linkedInUrl && (
                  <a
                    href={profile.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-primary hover:underline"
                  >
                    <FaLinkedin className="text-xl" />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
                {profile.websiteUrl && (
                  <a
                    href={profile.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-primary hover:underline"
                  >
                    <FaGlobe className="text-xl" />
                    <span>Website</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Membership Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Membership</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold ${
                  profile.membershipStatus === 'active' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {profile.membershipStatus || 'N/A'}
                </span>
              </div>
              {profile.includeInDirectory && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <span>✓</span>
                  <span>Listed in directory</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
