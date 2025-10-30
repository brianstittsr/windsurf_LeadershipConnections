'use client';

import React from 'react';
import Link from 'next/link';

const CTA = () => {
  return (
    <section className="py-16 md:py-20 lg:py-28 bg-primary text-white">
      <div className="container">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-[40px]">
            Ready to Unlock Your Potential?
          </h2>
          <p className="mb-8 text-lg text-white opacity-90 max-w-2xl mx-auto">
            Join us and become part of a community dedicated to fostering the next generation of leaders, innovators, and changemakers.
          </p>
          <Link
            href="/contact"
            className="rounded-md bg-white text-primary px-8 py-3 text-base font-semibold duration-300 ease-in-out hover:bg-opacity-90"
          >
            Get Involved Today
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
