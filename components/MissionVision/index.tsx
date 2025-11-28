'use client';

import React from 'react';

const MissionVision = () => {
  return (
    <section className="relative py-16 md:py-20 lg:py-28 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="container">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Vision */}
          <div className="wow fadeInUp" data-wow-delay=".1s">
            <div className="h-full rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-8 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl lg:p-12">
              <div className="mb-8 flex items-center justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
                  <svg
                    className="h-14 w-14 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="mb-6 text-center text-3xl font-bold text-white sm:text-4xl">
                Our Vision
              </h3>
              <p className="text-center text-lg leading-relaxed text-white/95">
                To develop a world-class Academy that will provide training and advocacy that propels youth to achieve the highest level of leadership.
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="wow fadeInUp" data-wow-delay=".2s">
            <div className="h-full rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-8 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl lg:p-12">
              <div className="mb-8 flex items-center justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
                  <svg
                    className="h-14 w-14 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="mb-6 text-center text-3xl font-bold text-white sm:text-4xl">
                Our Mission
              </h3>
              <p className="text-center text-lg leading-relaxed text-white/95">
                To equip youth with the necessary nutrition, education, knowledge, skills, and leadership abilities to effect global progress for boys and girls.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
