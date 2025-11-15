'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaUniversity, FaLaptopCode, FaBuilding, FaHeartbeat } from 'react-icons/fa';

const benefits = [
  {
    icon: <FaUniversity className="text-2xl text-primary" />,
    title: 'College and University Visits',
    description: 'Explore campuses and get inspired by what your future could hold!',
    imageUrl: '/images/programs/HighPoint_University/HPU-2022.jpg',
    link: '/lc-programs#college-visits',
  },
  {
    icon: <FaLaptopCode className="text-2xl text-primary" />,
    title: 'High Technology Learning',
    description: 'Engage in cutting-edge workshops that enhance your technological skills.',
    imageUrl: '/images/programs/Welborn/Robo Dog - Welborn.jpg',
    link: '/lc-programs#technology',
  },
  {
    icon: <FaBuilding className="text-2xl text-primary" />,
    title: 'Corporate Visits',
    description: 'Experience the inner workings of large corporations and see what it takes to succeed in various careers.',
    imageUrl: '/images/programs/Welborn/Simulation Academy - Welborn.jpg',
    link: '/lc-programs#corporate-visits',
  },
  {
    icon: <FaHeartbeat className="text-2xl text-primary" />,
    title: 'Fitness and Wellness Activities',
    description: 'From dance classes to fitness challenges, discover how to maintain a healthy lifestyle while having fun with your peers!',
    imageUrl: '/images/programs/Welborn/CoachKWelborn.jpg',
    link: '/lc-programs#wellness',
  },
];

const MemberExperiences = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-16 md:py-20 lg:py-28 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="mb-4 font-serif text-3xl font-bold text-body-color sm:text-4xl md:text-[40px]">
            What You Can Experience as a Member
          </h2>
          <p className="text-base text-body-color max-w-3xl mx-auto">
            Welcome to Leadership Connections, where every young person can embark on a transformative journey! We are dedicated to empowering underexposed and disenfranchised youth by fostering self-esteem, creativity, and leadership skills through innovative educational programs.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
          {/* Image card on the left, matching InteractiveBenefits style */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white p-6 rounded-lg shadow-one">
              <div className="relative w-full h-64 rounded-lg overflow-hidden mb-6">
                <Image
                  src={benefits[activeTab].imageUrl}
                  alt={benefits[activeTab].title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 67vw"
                />
              </div>
              <h3 className="font-serif text-2xl font-bold text-body-color mb-2">
                {benefits[activeTab].title}
              </h3>
              <p className="text-body-color text-sm">
                {benefits[activeTab].description}
              </p>
            </div>
          </div>

          {/* Links on the right */}
          <div className="w-full lg:w-1/3">
            <div className="flex flex-col gap-4">
              {benefits.map((benefit, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ease-in-out text-left bg-white shadow-one hover:bg-secondary ${
                    activeTab === index ? 'bg-secondary' : ''
                  }`}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary text-2xl shrink-0">
                    {benefit.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-body-color mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-body-color/80 mb-1">
                      {benefit.description}
                    </p>
                    <span className="text-sm inline-flex items-center font-medium text-primary">
                      Learn more
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemberExperiences;
