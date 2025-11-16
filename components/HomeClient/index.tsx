'use client';

import ScrollUp from "@/components/Common/ScrollUp";
import Hero from "@/components/Hero";
import InteractiveBenefits from "@/components/InteractiveBenefits";
import MissionVision from "@/components/MissionVision";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";

const HomeClient = () => {
  return (
    <>
      <ScrollUp />
      <Hero />
      <InteractiveBenefits />
      <MissionVision />
      <Testimonials />
      <CTA />
    </>
  );
};

export default HomeClient;
