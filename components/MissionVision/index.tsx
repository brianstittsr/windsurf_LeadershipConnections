'use client';

import React from 'react';

const MissionVision = () => {
  return (
    <section className="relative py-16 md:py-20 lg:py-28 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Vision */}
          <div className="wow fadeInUp" data-wow-delay=".1s">
            <div className="h-full rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800 lg:p-10">
              <div className="mb-6 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    className="h-8 w-8 text-primary"
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
              <h3 className="mb-4 text-center text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                Our Vision
              </h3>
              <p className="text-center text-base leading-relaxed text-body-color dark:text-gray-300">
                To develop a world-class Academy that will provide training and advocacy that propels youth to achieve the highest level of leadership.
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="wow fadeInUp" data-wow-delay=".2s">
            <div className="h-full rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800 lg:p-10">
              <div className="mb-6 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    className="h-8 w-8 text-primary"
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
              <h3 className="mb-4 text-center text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                Our Mission
              </h3>
              <p className="text-center text-base leading-relaxed text-body-color dark:text-gray-300">
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
