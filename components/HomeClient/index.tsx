'use client';

import { useState, useEffect } from 'react';
import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Blog from "@/components/Blog";
import Brands from "@/components/Brands";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Video from "@/components/Video";
import SplashScreen from "@/components/SplashScreen";

const HomeClient = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Automatically hide splash screen after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : (
        <>
          <ScrollUp />
          <Hero />
          <Features />
          <Video />
          <Brands />
          <AboutSectionOne />
          <AboutSectionTwo />
          <Testimonials />
          <Pricing />
          <Blog />
          <Contact />
        </>
      )}
    </>
  );
};

export default HomeClient;
