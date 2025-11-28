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
    <section className="relative py-16 md:py-20 lg:py-28 bg-white">
      <div className="container">
        {/* Section Title */}
        <div className="mb-12 text-center wow fadeInUp" data-wow-delay=".1s">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
            What Does C.O.N.N.E.C.T.I.O.N.S. Mean?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Each letter represents a core value that has guided our mission since 1991
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Image Section with Acronym Overlay */}
          <div className="wow fadeInLeft" data-wow-delay=".2s">
            <div className="sticky top-24">
              {/* Title for Left Image */}
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Original Acronym
              </h3>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/5 to-purple-50 p-6">
                <div className="relative h-[600px] w-full rounded-xl overflow-hidden bg-white shadow-inner">
                  <Image
                    src="/images/cellphone_images/8374467173046807092.webp"
                    alt="Original C.O.N.N.E.C.T.I.O.N.S. Acronym"
                    fill
                    className="object-contain p-4"
                  />
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-20 h-20 bg-primary/10 rounded-full -translate-x-10 -translate-y-10"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full translate-x-16 translate-y-16"></div>
              </div>

              {/* Image Caption */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 italic">
                  The original C.O.N.N.E.C.T.I.O.N.S. framework from 1991
                </p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="wow fadeInRight" data-wow-delay=".3s">
            {/* Acronym List - Featured */}
            <div className="mb-8">
              <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-purple-50/50 to-pink-50/50 p-8 shadow-lg border border-primary/10">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Expanded Acronym
                </h3>
                <div className="space-y-2">
                  {acronymWords.map((item, index) => (
                    <div
                      key={index}
                      className="wow fadeInUp flex items-center gap-3 p-3 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                      data-wow-delay={`${0.4 + index * 0.05}s`}
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-md">
                        <span className="text-2xl font-bold text-white">
                          {item.letter}
                        </span>
                      </div>
                      <span className="text-lg font-semibold text-gray-800">
                        {item.word}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Introduction Text */}
            <div className="mb-8 space-y-4">
              <div className="bg-blue-50 border-l-4 border-primary p-6 rounded-r-lg">
                <p className="text-gray-700 text-base leading-relaxed">
                  The acronym C.O.N.N.E.C.T.I.O.N.S. holds deep significance in our organization's history and mission. Originally conceived as a program specifically designed for youth, each letter represents a core value that has guided our work since our founding in 1991.
                </p>
              </div>

              <p className="text-gray-600 text-base leading-relaxed">
                When Katherine Harrelson founded Leadership Connections, she envisioned a comprehensive program that would address the unique challenges and opportunities facing young women, particularly those from underserved communities. The C.O.N.N.E.C.T.I.O.N.S. framework was developed to create meaningful pathways for girls to develop leadership skills, build confidence, and establish lasting relationships that would support their personal and professional growth.
              </p>

              <p className="text-gray-600 text-base leading-relaxed">
                The initial program for Leadership Connections was focused on saving our young women. The program has expanded based on past results to include young men and women.
              </p>
            </div>

            {/* Additional Context */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
              <h4 className="text-lg font-bold text-gray-900 mb-3">Our Impact</h4>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                Each component of the C.O.N.N.E.C.T.I.O.N.S. model was carefully crafted to address specific developmental needs of adolescent girls. The program recognized that young women often face unique societal pressures and barriers, and sought to create an empowering environment where they could explore their potential, develop their voices, and build the skills necessary to become effective leaders in their communities.
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                While our program has evolved over the years to serve a broader population, the foundational principles embedded in the C.O.N.N.E.C.T.I.O.N.S. acronym continue to guide our mission. These core values remain as relevant today as they were when we first began, serving as a testament to the enduring importance of intentional, values-based youth development programming.
              </p>
            </div>

            {/* Bottom tagline */}
            <div className="mt-8 text-center p-6 bg-gradient-to-r from-primary to-purple-600 rounded-xl shadow-lg">
              <p className="text-xl font-bold text-white">
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
