'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MemberProfile } from '@/types/member-profile.types';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function MemberProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchMemberProfile();
    }
  }, [userId]);

  const fetchMemberProfile = async () => {
    try {
      const memberDoc = await getDoc(doc(db, 'memberProfiles', userId));
      
      if (memberDoc.exists()) {
        const data = memberDoc.data();
        const memberData = {
          id: memberDoc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          lastActive: data.lastActive?.toDate() || new Date(),
        } as MemberProfile;

        // Check if member has opted into directory
        if (!memberData.includeInDirectory) {
          setError('This profile is not available in the directory.');
        } else {
          setMember(memberData);
        }
      } else {
        setError('Member profile not found.');
      }
    } catch (error) {
      console.error('Error fetching member profile:', error);
      setError('Failed to load member profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Profile Not Found'}
          </h1>
          <Link
            href="/member-directory"
            className="text-primary hover:underline"
          >
            ← Back to Member Directory
          </Link>
        </div>
      </div>
    );
  }

  const displayName = member.preferredName || `${member.firstName} ${member.lastName}`;
  const profileImage = member.profilePhotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=400&background=4F46E5&color=fff`;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/member-directory"
          className="inline-flex items-center text-primary hover:underline mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Directory
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary to-blue-600 h-32"></div>
          
          {/* Profile Content */}
          <div className="px-8 pb-8">
            {/* Profile Image */}
            <div className="relative -mt-16 mb-6">
              <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                <Image
                  src={profileImage}
                  alt={displayName}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Name and Title */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {displayName}
              </h1>
              {member.currentTitle && (
                <p className="text-xl text-gray-600 mb-1">{member.currentTitle}</p>
              )}
              {member.currentOrganization && (
                <p className="text-lg text-gray-500">{member.currentOrganization}</p>
              )}
            </div>

            {/* Programs */}
            {member.programs && member.programs.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Leadership Programs</h2>
                <div className="space-y-2">
                  {member.programs.map((program, index) => (
                    <div key={index} className="flex items-center gap-3 text-gray-700">
                      <svg className="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <span className="font-medium">{program.name}</span>
                        {program.graduationYear && (
                          <span className="text-gray-500"> • Class of {program.graduationYear}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bio */}
            {member.bio && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{member.bio}</p>
              </div>
            )}

            {/* Skills */}
            {member.skills && member.skills.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Skills & Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Volunteer Interests */}
            {member.volunteerInterests && member.volunteerInterests.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Volunteer Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {member.volunteerInterests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Connect</h2>
              <div className="flex flex-wrap gap-4">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </a>
                )}
                {member.linkedInUrl && (
                  <a
                    href={member.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LinkedIn
                  </a>
                )}
                {member.phone && member.showPhone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Phone
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
