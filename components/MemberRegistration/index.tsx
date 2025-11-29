'use client';

import { useState } from 'react';
import Image from 'next/image';
import MemberProfileWizardModal from './MemberProfileWizardModal';

const MemberRegistration = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

        {/* Example Profile Cards */}
        <div className="mb-12">
          <h3 className="mb-6 text-center text-xl font-semibold text-white">
            Meet Our Alumni
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {exampleProfiles.map((profile, index) => (
              <div
                key={`${profile.name}-${index}`}
                className="wow fadeInUp bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-1000"
                data-wow-delay={`${0.2 + index * 0.1}s`}
              >
                {/* Profile Image with Fade Transition */}
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  <div className="absolute inset-0 transition-opacity duration-1000 opacity-100">
                    <Image
                      src={profile.image}
                      alt={profile.name}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                </div>

                {/* Profile Content */}
                <div className="p-6">
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">
                    {profile.name}
                  </h4>

                  {/* Career Category */}
                  <div className="mb-4">
                    <div className="flex items-center text-gray-700 mb-2">
                      <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                      <span className="font-semibold">{profile.career}</span>
                    </div>
                  </div>

                  {/* Specializations */}
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
                        <span
                          key={idx}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="mb-4">
                    <div className="flex items-start text-gray-700 mb-2">
                      <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">Languages:</span>
                    </div>
                    <div className="ml-7">
                      <p className="text-gray-600">
                        {profile.languages.join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {profile.summary}
                  </p>

                  {/* View Profile Button */}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Create Your Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

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
