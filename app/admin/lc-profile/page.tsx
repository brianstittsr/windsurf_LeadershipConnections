'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { MemberProfile } from '@/types/member-profile.types';
import { getMemberProfile } from '@/lib/memberProfileUtils';
import { FaEdit, FaUser, FaBriefcase, FaComments, FaTools, FaCertificate, FaMapMarkerAlt } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

type TabType = 'basic' | 'professional' | 'social' | 'tools';

export default function MemberProfileView() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('basic');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }

    if (user) {
      loadProfile();
    }
  }, [user, authLoading, router]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const profileData = await getMemberProfile(user.uid);
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">You haven't created your profile yet.</p>
          <Link
            href="/admin/lc-profile/wizard"
            className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Create Profile
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'basic' as TabType, label: 'Basic Info', icon: FaUser },
    { id: 'professional' as TabType, label: 'Professional', icon: FaBriefcase },
    { id: 'social' as TabType, label: 'Social (LC Chat)', icon: FaComments },
    { id: 'tools' as TabType, label: 'Tools', icon: FaTools },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {/* Edit Button */}
        <div className="mb-6">
          <Link
            href="/admin/lc-profile/edit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <FaEdit />
            Edit Profile
          </Link>
        </div>

        {/* Profile Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            {/* Profile Photo */}
            {profile.profilePhotoUrl ? (
              <Image
                src={profile.profilePhotoUrl}
                alt={`${profile.firstName} ${profile.lastName}`}
                width={100}
                height={100}
                className="rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center border-4 border-gray-200">
                <span className="text-white text-3xl font-bold">
                  {profile.firstName?.[0]}{profile.lastName?.[0]}
                </span>
              </div>
            )}

            {/* Name and Title */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-gray-600">{profile.currentTitle || 'Member'}</p>
              {profile.currentOrganization && (
                <p className="text-gray-500 text-sm">{profile.currentOrganization}</p>
              )}
            </div>
          </div>

          {/* Certification Badge (if applicable) */}
          {profile.certifications && profile.certifications.length > 0 && (
            <div className="bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <FaCertificate />
                <span className="font-semibold">CERTIFICATION</span>
              </div>
              <p className="text-sm">Set Expiration Date</p>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="text-lg" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">First Name *</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <FaUser className="text-gray-400" />
                  <span className="text-gray-900">{profile.firstName || '-'}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Last Name *</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <FaUser className="text-gray-400" />
                  <span className="text-gray-900">{profile.lastName || '-'}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email *</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">{profile.email || '-'}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">{profile.phone || '-'}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Date Registered</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">
                    {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '-'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Member Type</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">{profile.membershipStatus || 'Active'}</span>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <span className="text-gray-900">
                    {[profile.city, profile.state, profile.zipCode].filter(Boolean).join(', ') || '-'}
                  </span>
                </div>
              </div>

              {profile.linkedInUrl && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">LinkedIn</label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <a
                      href={profile.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {profile.linkedInUrl}
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Professional Tab */}
          {activeTab === 'professional' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Position</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Job Title</label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{profile.currentTitle || '-'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Organization</label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{profile.currentOrganization || '-'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Industry</label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{profile.industry || '-'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Years of Experience</label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{profile.yearsExperience || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {profile.expertise && profile.expertise.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.expertise.map((item, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.skills && profile.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.boardMemberships && profile.boardMemberships.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Board Memberships</h3>
                  <div className="space-y-3">
                    {profile.boardMemberships.map((board, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900">{board.organization}</p>
                        <p className="text-sm text-gray-600">{board.role}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {board.current ? 'Current' : 'Past'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Social (LC Chat) Tab */}
          {activeTab === 'social' && (
            <div className="text-center py-12">
              <FaComments className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">LC Chat Coming Soon</h3>
              <p className="text-gray-600 mb-6">
                Connect and chat with other Leadership C.O.N.N.E.C.T.I.O.N.S. members.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-sm text-blue-800">
                  In-app messaging will allow you to network, share ideas, and collaborate with fellow alumni.
                </p>
              </div>
            </div>
          )}

          {/* Tools Tab */}
          {activeTab === 'tools' && (
            <div className="text-center py-12">
              <FaTools className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Member Tools</h3>
              <p className="text-gray-600 mb-6">
                Access resources and tools to help you grow professionally.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="p-6 bg-gray-50 rounded-lg text-left">
                  <h4 className="font-semibold text-gray-900 mb-2">Resources</h4>
                  <p className="text-sm text-gray-600">
                    Access leadership development materials and guides.
                  </p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg text-left">
                  <h4 className="font-semibold text-gray-900 mb-2">Events</h4>
                  <p className="text-sm text-gray-600">
                    View upcoming events and register for programs.
                  </p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg text-left">
                  <h4 className="font-semibold text-gray-900 mb-2">Mentorship</h4>
                  <p className="text-sm text-gray-600">
                    Connect with mentors or become a mentor yourself.
                  </p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg text-left">
                  <h4 className="font-semibold text-gray-900 mb-2">Directory</h4>
                  <p className="text-sm text-gray-600">
                    Search and connect with other members.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
