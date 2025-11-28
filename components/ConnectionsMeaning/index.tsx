'use client';

import React from 'react';
import Image from 'next/image';

const ConnectionsMeaning = () => {
  const acronymWords = [
    { letter: 'C', word: 'ommitment' },
    { letter: 'O', word: 'pportunity' },
    { letter: 'N', word: 'ever ending' },
    { letter: 'N', word: 'etworks' },
    { letter: 'E', word: 'mbracing' },
    { letter: 'C', word: 'ounty' },
    { letter: 'T', word: 'eamwork' },
    { letter: 'I', word: 'nfluencing' },
    { letter: 'O', word: 'ther' },
    { letter: 'N', word: 'ew Comers to' },
    { letter: 'S', word: 'ave our YOUTH' },
  ];

  return (
    <section className="relative py-16 md:py-20 lg:py-28 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        {/* Section Title */}
        <div className="mb-12 text-center wow fadeInUp" data-wow-delay=".1s">
          <h2 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-5xl">
            What Does C.O.N.N.E.C.T.I.O.N.S. Mean?
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="wow fadeInLeft" data-wow-delay=".2s">
            <div className="relative h-[500px] w-full rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/cellphone_images/8374467173046807092.jpg"
                alt="Original C.O.N.N.E.C.T.I.O.N.S. Acronym"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="wow fadeInRight" data-wow-delay=".3s">
            {/* Introduction Text */}
            <div className="mb-8">
              <p className="text-body-color dark:text-gray-300 mb-6 text-base leading-relaxed">
                The acronym C.O.N.N.E.C.T.I.O.N.S. holds deep significance in our organization's history and mission. Originally conceived as a program specifically designed for youth, each letter of our name represents a core value that has guided our work since our founding in 1991.
              </p>
              <p className="text-body-color dark:text-gray-300 mb-6 text-base leading-relaxed">
                When Katherine Harrelson founded Leadership Connections, she envisioned a comprehensive program that would address the unique challenges and opportunities facing young women, particularly those from underserved communities. The C.O.N.N.E.C.T.I.O.N.S. framework was developed to create meaningful pathways for girls to develop leadership skills, build confidence, and establish lasting relationships that would support their personal and professional growth.
              </p>
              <p className="text-body-color dark:text-gray-300 mb-6 text-base leading-relaxed">
                The initial program for Leadership Connections was focused on saving our young women. The program has expanded based on past results to include young men and women hence:
              </p>
            </div>

            {/* Acronym List with Highlight */}
            <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl border-2 border-primary/20">
              <div className="space-y-3">
                {acronymWords.map((item, index) => (
                  <div
                    key={index}
                    className="wow fadeInUp flex items-baseline gap-2 text-xl font-semibold text-gray-800 dark:text-gray-200 sm:text-2xl md:text-3xl bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-900/20 dark:to-transparent p-2 rounded-lg"
                    data-wow-delay={`${0.4 + index * 0.05}s`}
                  >
                    <span className="text-3xl font-bold text-primary sm:text-4xl md:text-5xl">
                      {item.letter}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.word}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Context */}
            <div className="mt-8">
              <p className="text-body-color dark:text-gray-300 text-base leading-relaxed">
                Each component of the C.O.N.N.E.C.T.I.O.N.S. model was carefully crafted to address specific developmental needs of adolescent girls. The program recognized that young women often face unique societal pressures and barriers, and sought to create an empowering environment where they could explore their potential, develop their voices, and build the skills necessary to become effective leaders in their communities.
              </p>
              <p className="text-body-color dark:text-gray-300 mt-4 text-base leading-relaxed">
                While our program has evolved over the years to serve a broader population, the foundational principles embedded in the C.O.N.N.E.C.T.I.O.N.S. acronym continue to guide our mission. These core values remain as relevant today as they were when we first began, serving as a testament to the enduring importance of intentional, values-based youth development programming.
              </p>
            </div>

            {/* Bottom tagline */}
            <div className="mt-8 text-center">
              <p className="text-lg font-semibold text-primary dark:text-primary-light">
                Together, we build C.O.N.N.E.C.T.I.O.N.S. that last a lifetime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConnectionsMeaning;
