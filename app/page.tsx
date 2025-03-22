'use client';

import LC_Navigation from './components/LC_Navigation';
import LC_Hero from './components/LC_Hero';
import LC_Home_WhyJoin_LC from './components/LC_Home_WhyJoin_LC';
import LC_Home_WhoShouldApply_LC from './components/LC_Home_WhoShouldApply_LC';
import LC_Footer from './components/LC_Footer';

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
