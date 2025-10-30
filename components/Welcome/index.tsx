'use client';

import React from 'react';

const Welcome = () => {
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="wow fadeInUp" data-wow-delay=".2s">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-1/2">
              <div className="mb-12 max-w-[570px] lg:mb-0">
                <h2 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-[40px]">
                  Welcome to Leadership C.O.N.N.E.C.T.I.O.N.S.
                </h2>
                <p className="mb-6 text-base text-body-color dark:text-dark-6">
                  Welcome to Leadership Connections, where every young person can embark on a transformative journey! We are dedicated to empowering underexposed and disenfranchised youth by fostering self-esteem, creativity, and leadership skills through innovative educational programs. Our vibrant initiatives like Red Carpet Kids USA, along with partnerships such as Michelle Obama’s Let's Move and Cisco Field Trip, offer an exciting exploration into various fields and experiences.
                </p>
              </div>
            </div>
            <div className="w-full px-4 lg:w-1/2">
              <div className="-mx-4 flex flex-wrap">
                <div className="w-full px-4 md:w-1/2">
                  <div className="mb-8 rounded-md bg-primary bg-opacity-10 p-6 text-center">
                    <h3 className="mb-2 text-xl font-semibold text-primary">College and University Visits</h3>
                    <p className="text-base text-body-color dark:text-dark-6">Explore campuses and get inspired by what your future could hold!</p>
                  </div>
                </div>
                <div className="w-full px-4 md:w-1/2">
                  <div className="mb-8 rounded-md bg-primary bg-opacity-10 p-6 text-center">
                    <h3 className="mb-2 text-xl font-semibold text-primary">High Technology Learning</h3>
                    <p className="text-base text-body-color dark:text-dark-6">Engage in cutting-edge workshops that enhance your technological skills.</p>
                  </div>
                </div>
                <div className="w-full px-4 md:w-1/2">
                  <div className="mb-8 rounded-md bg-primary bg-opacity-10 p-6 text-center">
                    <h3 className="mb-2 text-xl font-semibold text-primary">Corporate Visits</h3>
                    <p className="text-base text-body-color dark:text-dark-6">Experience the inner workings of large corporations and see what it takes to succeed in various careers.</p>
                  </div>
                </div>
                <div className="w-full px-4 md:w-1/2">
                  <div className="mb-8 rounded-md bg-primary bg-opacity-10 p-6 text-center">
                    <h3 className="mb-2 text-xl font-semibold text-primary">Fitness and Wellness Activities</h3>
                    <p className="text-base text-body-color dark:text-dark-6">From dance classes to fitness challenges, discover how to maintain a healthy lifestyle while having fun with your peers!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
