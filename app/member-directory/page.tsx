'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MemberProfile } from '@/types/member-profile.types';
import Image from 'next/image';
import Link from 'next/link';

export default function MemberDirectoryPage() {
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupedMembers, setGroupedMembers] = useState<{ [key: string]: MemberProfile[] }>({});

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const membersRef = collection(db, 'memberProfiles');
      const q = query(
        membersRef,
        where('includeInDirectory', '==', true),
        orderBy('programs', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const memberData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        lastActive: doc.data().lastActive?.toDate() || new Date(),
      })) as MemberProfile[];

      setMembers(memberData);
      groupMembersByClass(memberData);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupMembersByClass = (members: MemberProfile[]) => {
    const grouped: { [key: string]: MemberProfile[] } = {};

    members.forEach(member => {
      if (member.programs && member.programs.length > 0) {
        // Use the first program as the primary class
        const className = String(member.programs[0]);
        if (!grouped[className]) {
          grouped[className] = [];
        }
        grouped[className].push(member);
      } else {
        // Members without a class
        if (!grouped['Other']) {
          grouped['Other'] = [];
        }
        grouped['Other'].push(member);
      }
    });

    setGroupedMembers(grouped);
  };

  const getLevelBadgeColor = (level: string | undefined) => {
    switch (level?.toLowerCase()) {
      case 'advanced':
        return 'bg-purple-500';
      case 'intermediate':
        return 'bg-blue-500';
      case 'entry':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading member directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Leadership C.O.N.N.E.C.T.I.O.N.S. Members
            </h1>
            <p className="text-gray-600">
              Connect with fellow members and alumni
            </p>
          </div>
          <Link
            href="/admin/lc-profile"
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            + Register As A Member
          </Link>
        </div>

        {/* Member Cards Grouped by Class */}
        {Object.keys(groupedMembers).sort().map((className) => (
          <div key={className} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-primary pb-2">
              {className}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {groupedMembers[className].map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Profile Photo */}
                  <div className="relative h-64 bg-gray-200">
                    {member.profilePhotoUrl ? (
                      <Image
                        src={member.profilePhotoUrl}
                        alt={`${member.firstName} ${member.lastName}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-blue-600">
                        <span className="text-white text-6xl font-bold">
                          {member.firstName?.[0]}{member.lastName?.[0]}
                        </span>
                      </div>
                    )}
                    
                    {/* Level Badge */}
                    {member.membershipStatus && (
                      <div className={`absolute top-4 right-4 ${getLevelBadgeColor(member.membershipStatus)} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                        {member.membershipStatus}
                      </div>
                    )}
                  </div>

                  {/* Member Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {member.firstName} {member.lastName}
                    </h3>

                    {/* Location */}
                    {(member.city || member.state) && (
                      <div className="flex items-center text-gray-600 mb-3">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">
                          {member.city}{member.city && member.state ? ', ' : ''}{member.state}
                        </span>
                      </div>
                    )}

                    {/* Specializations */}
                    {member.expertise && member.expertise.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-start text-gray-700 mb-2">
                          <svg className="w-4 h-4 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                          </svg>
                          <span className="text-sm font-medium">Specializations:</span>
                        </div>
                        <div className="flex flex-wrap gap-2 ml-6">
                          {member.expertise.slice(0, 3).map((exp, idx) => (
                            <span
                              key={idx}
                              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs border border-blue-200"
                            >
                              {exp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills/Languages */}
                    {member.skills && member.skills.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-start text-gray-700 mb-2">
                          <svg className="w-4 h-4 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">Languages:</span>
                        </div>
                        <div className="ml-6">
                          <p className="text-sm text-gray-600">
                            {member.skills.slice(0, 3).join(', ')}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Bio */}
                    {member.bio && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {member.bio}
                      </p>
                    )}

                    {/* View Profile Button */}
                    <Link
                      href={`/member-profile/${member.id}`}
                      className="block w-full bg-primary hover:bg-primary/90 text-white text-center font-semibold py-2 rounded-lg transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* No Members Message */}
        {members.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No members found in the directory.</p>
            <Link
              href="/admin/lc-profile"
              className="inline-block mt-4 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Be the first to register!
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
