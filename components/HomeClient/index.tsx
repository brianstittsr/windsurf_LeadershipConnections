'use client';

import ScrollUp from "@/components/Common/ScrollUp";
import Hero from "@/components/Hero";
import InteractiveBenefits from "@/components/InteractiveBenefits";
import MemberExperiences from "@/components/MemberExperiences";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";

const HomeClient = () => {
  return (
    <>
      <ScrollUp />
      <Hero />
      <InteractiveBenefits />
      <MemberExperiences />
      <Testimonials />
      <CTA />
    </>
  );
};

export default HomeClient;
