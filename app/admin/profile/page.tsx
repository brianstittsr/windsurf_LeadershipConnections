'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MemberProfile } from '@/lib/firestore-schema';
import Image from 'next/image';
import Link from 'next/link';

const ProfilePage = () => {
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'alumni'>('all');

  useEffect(() => {
    fetchMembers();
  }, [filter]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      let querySnapshot;
      
      if (filter !== 'all') {
        const q = query(collection(db, 'memberProfiles'), where('membershipStatus', '==', filter));
        querySnapshot = await getDocs(q);
      } else {
        querySnapshot = await getDocs(collection(db, 'memberProfiles'));
      }

      const membersData = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as MemberProfile))
        .filter(member => member.includeInDirectory); // Only show members who opted in

      setMembers(membersData);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultImage = (name: string) => {
    // Generate a placeholder with initials
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=4F46E5&color=fff&bold=true`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading member profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl">
            Member Directory
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Connect with Leadership C.O.N.N.E.C.T.I.O.N.S. members and alumni
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="mb-8 flex justify-center gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Members ({members.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filter === 'active'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('alumni')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filter === 'alumni'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Alumni
          </button>
        </div>

        {/* Member Cards Grid */}
        {members.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No members found with the selected filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                {/* Profile Image */}
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  <Image
                    src={member.profilePhotoUrl || getDefaultImage(`${member.firstName} ${member.lastName}`)}
                    alt={`${member.firstName} ${member.lastName}`}
                    fill
                    className="object-cover"
                  />
                  {/* Membership Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      member.membershipStatus === 'alumni'
                        ? 'bg-blue-500 text-white'
                        : member.membershipStatus === 'active'
                        ? 'bg-green-500 text-white'
                        : 'bg-purple-500 text-white'
                    }`}>
                      {member.membershipStatus === 'alumni' ? 'Alumni' : 
                       member.membershipStatus === 'active' ? 'Active' : 'Lifetime'}
                    </span>
                  </div>
                </div>

                {/* Profile Content */}
                <div className="p-6">
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    {member.preferredName || `${member.firstName} ${member.lastName}`}
                  </h4>

                  {/* Job Title */}
                  {member.currentTitle && (
                    <div className="mb-4">
                      <div className="flex items-center text-gray-700 mb-2">
                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                          <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                        </svg>
                        <span className="font-semibold">{member.currentTitle}</span>
                      </div>
                      {member.currentOrganization && (
                        <p className="text-sm text-gray-600 ml-7">{member.currentOrganization}</p>
                      )}
                    </div>
                  )}

                  {/* Programs */}
                  {member.programs && member.programs.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-start text-gray-700 mb-2">
                        <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                        <span className="font-semibold">Programs:</span>
                      </div>
                      <div className="flex flex-wrap gap-2 ml-7">
                        {member.programs.map((program, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200"
                          >
                            {program.name} ({program.graduationYear})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {member.skills && member.skills.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-start text-gray-700 mb-2">
                        <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Skills:</span>
                      </div>
                      <div className="flex flex-wrap gap-2 ml-7">
                        {member.skills.slice(0, 5).map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm border border-green-200"
                          >
                            {skill}
                          </span>
                        ))}
                        {member.skills.length > 5 && (
                          <span className="text-gray-500 text-sm">+{member.skills.length - 5} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Bio */}
                  {member.bio && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {member.bio}
                    </p>
                  )}

                  {/* Contact Info */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-1 hover:text-primary"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        Email
                      </a>
                    )}
                    {member.linkedInUrl && (
                      <a
                        href={member.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-primary"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                        </svg>
                        LinkedIn
                      </a>
                    )}
                  </div>

                  {/* View Profile Button */}
                  <Link
                    href={`/member-directory/${member.id}`}
                    className="block w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-colors text-center"
                  >
                    View Full Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
