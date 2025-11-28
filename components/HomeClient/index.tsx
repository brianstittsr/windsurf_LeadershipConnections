'use client';

import ScrollUp from "@/components/Common/ScrollUp";
import Hero from "@/components/Hero";
import InteractiveBenefits from "@/components/InteractiveBenefits";
import MissionVision from "@/components/MissionVision";
import ConnectionsMeaning from "@/components/ConnectionsMeaning";
import MemberRegistration from "@/components/MemberRegistration";
import CTA from "@/components/CTA";

const HomeClient = () => {
  return (
    <>
      <ScrollUp />
      <Hero />
      <InteractiveBenefits />
      <MissionVision />
      <ConnectionsMeaning />
      <MemberRegistration />
      <CTA />
    </>
  );
};

export default HomeClient;
