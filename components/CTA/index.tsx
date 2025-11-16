'use client';

import React from 'react';
import Link from 'next/link';
import { useHomeContent } from '@/hooks/useHomeContent';

const CTA = () => {
  const { content, loading } = useHomeContent();

  if (loading) {
    return (
      <section className="relative py-16 md:py-20 lg:py-28 bg-primary text-white">
        <div className="container">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-10 bg-white/20 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-6 bg-white/20 rounded w-1/2 mx-auto mb-8"></div>
              <div className="h-12 bg-white/20 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 md:py-20 lg:py-28 bg-primary text-white">
        <div className="absolute inset-0 bg-repeat bg-center opacity-10" style={{ backgroundImage: "url('/images/hero/shape-01.svg')" }}></div>
      <div className="container">
        <div className="text-center">
          <h2 className="mb-4 font-serif text-3xl font-bold sm:text-4xl md:text-[40px]">
            {content.cta.title}
          </h2>
          <p className="mb-8 text-lg text-white opacity-90 max-w-2xl mx-auto">
            {content.cta.description}
          </p>
          <Link
            href={content.cta.buttonLink}
            className="rounded-md bg-accent text-white px-8 py-3 text-base font-semibold duration-300 ease-in-out hover:bg-opacity-90"
          >
            {content.cta.buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
