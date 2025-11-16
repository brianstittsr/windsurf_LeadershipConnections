'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaUniversity, FaLaptopCode, FaBuilding, FaHeartbeat } from 'react-icons/fa';

const benefits = [
  {
    icon: <FaUniversity className="text-4xl text-primary" />,
    title: 'College and University Visits',
    description: 'Explore campuses and get inspired by what your future could hold!',
    imageUrl: '/images/programs/HighPoint_University/HPU-2022.jpg',
  },
  {
    icon: <FaLaptopCode className="text-4xl text-primary" />,
    title: 'High Technology Learning',
    description: 'Engage in cutting-edge workshops that enhance your technological skills.',
    imageUrl: '/images/programs/Welborn/Robo Dog - Welborn.jpg',
  },
  {
    icon: <FaBuilding className="text-4xl text-primary" />,
    title: 'Corporate Visits',
    description: 'Experience the inner workings of large corporations and see what it takes to succeed in various careers.',
    imageUrl: '/images/programs/Cisco/Cisco4.png',
  },
  {
    icon: <FaHeartbeat className="text-4xl text-primary" />,
    title: 'Fitness and Wellness Activities',
    description: 'From dance classes to fitness challenges, discover how to maintain a healthy lifestyle while having fun with your peers!',
    imageUrl: '/images/programs/Welborn/CoachKWelborn.jpg',
  },
];

const InteractiveBenefits = () => {
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
          {/* Tabs on the left */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            {benefits.map((benefit, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ease-in-out w-full text-left ${activeTab === index ? 'bg-secondary text-primary shadow-one' : 'bg-white hover:bg-secondary'}`}>
                <div className="text-primary">{benefit.icon}</div>
                <h3 className="font-semibold text-lg text-body-color">{benefit.title}</h3>
              </button>
            ))}
          </div>

          {/* Content on the right */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white p-6 rounded-lg shadow-one min-h-[400px]">
              <div className="relative w-full h-64 rounded-lg overflow-hidden mb-6">
                <Image
                  src={benefits[activeTab].imageUrl}
                  alt={benefits[activeTab].title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 67vw"
                />
              </div>
              <h3 className="font-serif text-2xl font-bold text-body-color mb-4">{benefits[activeTab].title}</h3>
              <p className="text-body-color">{benefits[activeTab].description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveBenefits;
