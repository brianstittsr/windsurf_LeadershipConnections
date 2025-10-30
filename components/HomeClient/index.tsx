'use client';

import ScrollUp from "@/components/Common/ScrollUp";
import Hero from "@/components/Hero";
import Welcome from "@/components/Welcome";
import Benefits from "@/components/Benefits";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";

const HomeClient = () => {
  return (
    <>
      <ScrollUp />
      <Hero />
      <Welcome />
      <Benefits />
      <Testimonials />
      <CTA />
    </>
  );
};

export default HomeClient;
