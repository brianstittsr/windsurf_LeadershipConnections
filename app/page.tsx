'use client';

import dynamic from 'next/dynamic';

// Use dynamic imports with SSR disabled to prevent build errors
const LC_Navigation = dynamic(() => import('./components/LC_Navigation'), { ssr: false });
const LC_Hero = dynamic(() => import('./components/LC_Hero'), { ssr: false });
const LC_Home_WhyJoin_LC = dynamic(() => import('./components/LC_Home_WhyJoin_LC'), { ssr: false });
const LC_Home_WhoShouldApply_LC = dynamic(() => import('./components/LC_Home_WhoShouldApply_LC'), { ssr: false });
const LC_Footer = dynamic(() => import('./components/LC_Footer'), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white">
      {/* 1. Navigation */}
      <LC_Navigation />
      
      {/* 2. Hero Section */}
      <LC_Hero />
      
      {/* 3. Why Join Leadership Connections Section */}
      <LC_Home_WhyJoin_LC />
      
      {/* 4. Who Should Apply Section */}
      <LC_Home_WhoShouldApply_LC />
      
      {/* 5. Footer */}
      <LC_Footer />
    </div>
  );
}
