'use client';

import Blog from "@/components/Blog";
import ScrollUp from "@/components/Common/ScrollUp";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Video from "@/components/Video";

const HomeClient = () => {
  return (
    <>
      <ScrollUp />
      <Hero />
      <Features />
      <Video />
      <Blog />
    </>
  );
};

export default HomeClient;
