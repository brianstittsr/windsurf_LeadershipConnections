import React from 'react';
import Image from 'next/image';

interface ProgramFeature {
  title: string;
  description: string;
  imagePath: string;
  learnMoreLink: string;
}

const programFeatures: ProgramFeature[] = [
  {
    title: 'Leadership Basics & Character Education',
    description: 'Build foundational skills for ethical and effective leadership.',
    imagePath: '/images/leadership-basics.svg',
    learnMoreLink: '/leadership-basics',
  },
  {
    title: 'Philanthropic Leadership & Civic Responsibility',
    description: 'Develop a heart for service and a drive for positive change.',
    imagePath: '/images/philanthropic-leadership.svg',
    learnMoreLink: '/philanthropic-leadership',
  },
  {
    title: '3-Tier Mentoring Support Services',
    description: 'Gain guidance and insights from experienced mentors.',
    imagePath: '/images/mentoring-support.svg',
    learnMoreLink: '/mentoring-support',
  },
  {
    title: 'Summer "College Experience" Retreat',
    description: 'Experience campus life while building independence and academic focus.',
    imagePath: '/images/college-experience.svg',
    learnMoreLink: '/college-experience',
  },
  {
    title: 'Inter-Generational Networking',
    description: 'Connect with role models and peers across diverse industries and backgrounds.',
    imagePath: '/images/networking.svg',
    learnMoreLink: '/networking',
  },
  {
    title: 'Expand Your Network',
    description: 'Connect with a diverse group of peers, mentors, and professionals across generations, building relationships that open doors to new opportunities.',
    imagePath: '/images/expand-network.svg',
    learnMoreLink: '/expand-network',
  },
];

const ProgramFeatures: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Join the Leadership C.O.N.N.E.C.T.I.O.N.S. Program?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-48 h-48 relative mb-6">
                  <Image
                    src={feature.imagePath}
                    alt={feature.title}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <a
                  href={feature.learnMoreLink}
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-300"
                >
                  Learn More
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramFeatures;
