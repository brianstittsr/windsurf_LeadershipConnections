'use client';

import React from 'react';
import Image from 'next/image';

const benefits = [
  {
    title: 'College and University Visits',
    description: 'Explore campuses and get inspired by what your future could hold!',
    imageUrl: '/images/programs/college-experience.jpg',
  },
  {
    title: 'High Technology Learning',
    description: 'Engage in cutting-edge workshops that enhance your technological skills.',
    imageUrl: '/images/programs/college-experience.jpg',
  },
  {
    title: 'Corporate Visits',
    description: 'Experience the inner workings of large corporations and see what it takes to succeed in various careers.',
    imageUrl: '/images/programs/inter-generational.jpg',
  },
  {
    title: 'Fitness and Wellness Activities',
    description: 'From dance classes to fitness challenges, discover how to maintain a healthy lifestyle while having fun with your peers!',
    imageUrl: '/images/programs/red-carpet-kids.jpg',
  },
];

const Benefits = () => {
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-[40px]">
            What You Can Experience as a Member
          </h2>
          <p className="text-base text-body-color dark:text-dark-6 max-w-3xl mx-auto">
            Our vibrant initiatives and partnerships offer an exciting exploration into various fields and experiences. Join us and unlock your potential!
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {benefits.map((benefit, index) => (
            <div key={index} className="wow fadeInUp group" data-wow-delay={`${0.1 * (index + 1)}s`}>
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={benefit.imageUrl}
                  alt={benefit.title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-64 transform transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6">
                  <h3 className="mb-2 text-2xl font-bold text-white">{benefit.title}</h3>
                  <p className="text-white opacity-90">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
