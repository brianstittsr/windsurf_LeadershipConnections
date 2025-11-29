'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MemberProfile } from '@/types/member-profile.types';
import MemberProfileWizardModal from './MemberProfileWizardModal';

const MemberRegistration = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [realProfiles, setRealProfiles] = useState<MemberProfile[]>([]);
  const [displayedProfiles, setDisplayedProfiles] = useState<MemberProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Static profiles - no animation
  const exampleProfiles = [
    {
      name: 'Shanice Roberts',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=800',
      career: 'Education Administration',
      specializations: ['Curriculum Development', 'Teacher Training', 'Student Success'],
      languages: ['English', 'Spanish'],
      summary: 'Education leader committed to creating equitable learning opportunities and empowering educators to reach every student.'
    },
    {
      name: 'Terrell Jackson',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800',
      career: 'Social Work',
      specializations: ['Youth Services', 'Family Counseling', 'Crisis Intervention'],
      languages: ['English'],
      summary: 'Compassionate social worker dedicated to supporting families and youth through challenging times and building resilience.'
    }
  ];

  // Fetch real member profiles who opted in to be featured
  useEffect(() => {
    const fetchFeaturedProfiles = async () => {
      try {
        const profilesRef = collection(db, 'memberProfiles');
        const q = query(
          profilesRef,
          where('includeInDirectory', '==', true),
          where('profilePhotoUrl', '!=', null),
          orderBy('profilePhotoUrl'),
          orderBy('createdAt', 'desc'),
          limit(20) // Get up to 20 profiles for rotation
        );
        
        const snapshot = await getDocs(q);
        const profiles = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          lastActive: doc.data().lastActive?.toDate() || new Date(),
        })) as MemberProfile[];

        setRealProfiles(profiles);
        
        // Initialize with first 2 profiles if available
        if (profiles.length >= 2) {
          setDisplayedProfiles([profiles[0], profiles[1]]);
        }
      } catch (error) {
        console.error('Error fetching featured profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProfiles();
  }, []);

  // Rotate profiles every 5 seconds if we have more than 2
  useEffect(() => {
    if (realProfiles.length <= 2) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 2) % realProfiles.length;
        const profile1 = realProfiles[nextIndex];
        const profile2 = realProfiles[(nextIndex + 1) % realProfiles.length];
        setDisplayedProfiles([profile1, profile2]);
        return nextIndex;
      });
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, [realProfiles]);

  // Determine which profiles to show
  const showStaticProfiles = realProfiles.length < 2;
  const profilesToDisplay = showStaticProfiles ? exampleProfiles : displayedProfiles;

  return (
    <>
      <MemberProfileWizardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <section className="relative z-10 overflow-hidden bg-primary py-16 md:py-20 lg:py-28">
      <div className="container">
        {/* Header */}
        <div className="mb-12 text-center wow fadeInUp" data-wow-delay=".1s">
          <h2 className="mb-4 text-3xl font-bold leading-tight text-white sm:text-4xl sm:leading-tight md:text-[45px] md:leading-tight">
            Join the C.O.N.N.E.C.T.IO.N.S. Alumni Network
          </h2>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-white md:text-lg md:leading-relaxed">
            Are you a Leadership C.O.N.N.E.C.T.I.O.N.S. graduate? Register your profile to connect with fellow alumni, current members, and faculty. Share your expertise, find mentorship opportunities, and stay engaged with our growing community.
          </p>
        </div>

        {/* Profile Cards - Static or Dynamic */}
        {!loading && (
          <div className="mb-12">
            <h3 className="mb-6 text-center text-xl font-semibold text-white">
              {showStaticProfiles ? 'Meet Our Alumni' : `Meet Our Alumni (${realProfiles.length} Members)`}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {showStaticProfiles ? (
                // Static example profiles
                exampleProfiles.map((profile, index) => (
                  <div
                    key={`static-${profile.name}-${index}`}
                    className="wow fadeInUp bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-1000"
                    data-wow-delay={`${0.2 + index * 0.1}s`}
                  >
                    <div className="relative h-64 bg-gray-200 overflow-hidden">
                      <Image
                        src={profile.image}
                        alt={profile.name}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                    <div className="p-6">
                      <h4 className="text-2xl font-bold text-gray-900 mb-4">{profile.name}</h4>
                      <div className="mb-4">
                        <div className="flex items-center text-gray-700 mb-2">
                          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                          </svg>
                          <span className="font-semibold">{profile.career}</span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="flex items-start text-gray-700 mb-2">
                          <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                          </svg>
                          <span className="font-semibold">Specializations:</span>
                        </div>
                        <div className="flex flex-wrap gap-2 ml-7">
                          {profile.specializations.map((spec, idx) => (
                            <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">{profile.summary}</p>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-colors"
                      >
                        Create Your Profile
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                // Real member profiles with smooth transitions
                displayedProfiles.map((profile, index) => (
                  <div
                    key={`real-${profile.id}-${currentIndex}-${index}`}
                    className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-1000 animate-fadeIn"
                  >
                    <div className="relative h-64 bg-gray-200 overflow-hidden">
                      {profile.profilePhotoUrl && (
                        <Image
                          src={profile.profilePhotoUrl}
                          alt={`${profile.firstName} ${profile.lastName}`}
                          fill
                          className="object-cover transition-opacity duration-1000"
                          priority={index === 0}
                        />
                      )}
                    </div>
                    <div className="p-6">
                      <h4 className="text-2xl font-bold text-gray-900 mb-4">
                        {profile.firstName} {profile.lastName}
                      </h4>
                      {profile.currentTitle && (
                        <div className="mb-4">
                          <div className="flex items-center text-gray-700 mb-2">
                            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                            </svg>
                            <span className="font-semibold">{profile.currentTitle}</span>
                          </div>
                          {profile.currentOrganization && (
                            <p className="text-gray-600 text-sm ml-7">{profile.currentOrganization}</p>
                          )}
                        </div>
                      )}
                      {profile.expertise && profile.expertise.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-start text-gray-700 mb-2">
                            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                            </svg>
                            <span className="font-semibold">Expertise:</span>
                          </div>
                          <div className="flex flex-wrap gap-2 ml-7">
                            {profile.expertise.slice(0, 3).map((exp, idx) => (
                              <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200">
                                {exp}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {profile.bio && (
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{profile.bio}</p>
                      )}
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-colors"
                      >
                        Join Our Network
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center wow fadeInUp" data-wow-delay=".4s">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white hover:bg-gray-100 text-primary font-bold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Create Your Profile Today
          </button>
          <p className="text-white/90 mt-4 text-sm">
            Already have an account?{' '}
            <a href="/signin" className="text-white underline hover:no-underline">
              Sign in here
            </a>
          </p>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute left-0 top-0 z-[-1]">
        <svg
          width="370"
          height="596"
          viewBox="0 0 370 596"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_88:141"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="370"
            height="596"
          >
            <rect width="370" height="596" rx="2" fill="#1D2144" />
          </mask>
          <g mask="url(#mask0_88:141)">
            <path
              opacity="0.15"
              d="M15.4076 50.9571L54.1541 99.0711L71.4489 35.1605L15.4076 50.9571Z"
              fill="white"
            />
            <path
              opacity="0.15"
              d="M20.7137 501.422L44.6431 474.241L6 470.624L20.7137 501.422Z"
              fill="white"
            />
          </g>
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 z-[-1]">
        <svg
          width="370"
          height="596"
          viewBox="0 0 370 596"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_88:142"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="370"
            height="596"
          >
            <rect width="370" height="596" rx="2" fill="#1D2144" />
          </mask>
          <g mask="url(#mask0_88:142)">
            <path
              opacity="0.15"
              d="M331.676 -3.42137L297.371 45.2563L326.965 -44.9829L331.676 -3.42137Z"
              fill="white"
            />
            <path
              opacity="0.15"
              d="M358 572.652L365.608 580.39L369.882 575.377L358 572.652Z"
              fill="white"
            />
          </g>
        </svg>
      </div>
    </section>
    </>
  );
};

export default MemberRegistration;
