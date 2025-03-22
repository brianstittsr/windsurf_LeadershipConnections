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
import { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "Leadership C.O.N.N.E.C.T.I.O.N.S.",
  description: "Leadership C.O.N.N.E.C.T.I.O.N.S. is dedicated to fostering leadership skills and building meaningful connections in communities.",
  // other metadata
};

export default function Home() {
  return <HomeClient />;
}
