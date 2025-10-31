'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/styles/hero-slider.css";
import "@/styles/hero-background.css";
import "@/styles/hero-animations.css";
import Image from "next/image";

interface SlideProps {
  title: string;
  subtitle: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  imageUrl: string;
}

const HeroSlide = ({ slide, index }: { slide: SlideProps; index: number }) => {
  return (
    <div className="relative h-screen w-full">
      <Image
        src={slide.imageUrl}
        alt={slide.title}
        fill
        className="object-cover w-full h-full"
        priority={index === 0}
        sizes="100vw"
      />
      <div className="absolute inset-0 flex items-center justify-center text-center text-white bg-black bg-opacity-50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 font-serif text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">{slide.subtitle}</h2>
            <h1 className="text-4xl md:text-6xl font-bold mb-8 font-serif text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">{slide.title}</h1>
            <p className="text-lg md:text-xl mb-10 text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">{slide.description}</p>
            <Link
              href={slide.primaryButtonLink}
              className="rounded-md bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-opacity-90"
            >
              {slide.primaryButtonText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const slides: SlideProps[] = [
    {
      title: "Transformative Journeys Start Here",
      subtitle: "Welcome to Leadership C.O.N.N.E.C.T.I.O.N.S.",
      description: "Empowering underexposed and disenfranchised youth by fostering self-esteem, creativity, and leadership skills through innovative educational programs.",
      primaryButtonText: "Get Involved",
      primaryButtonLink: "/contact",
      imageUrl: "/images/programs/Welborn/Simulation Academy - Welborn.jpg"
    },
    {
      title: "Explore Your Future",
      subtitle: "College and University Visits",
      description: "Explore campuses and get inspired by what your future could hold!",
      primaryButtonText: "Our Programs",
      primaryButtonLink: "/lc-programs",
      imageUrl: "/images/programs/HighPoint_University/hpu2_orig.jpg"
    },
    {
      title: "Engage with Technology",
      subtitle: "High Technology Learning",
      description: "Engage in cutting-edge workshops that enhance your technological skills.",
      primaryButtonText: "Learn More",
      primaryButtonLink: "/lc-programs",
      imageUrl: "/images/programs/Michelle Obama Empowerment Academy/RCK_Firebirds_spring2024/Screenshot 2025-10-31 005307.png"
    },
    {
      title: "Explore the Arts, Fitness and Nutrition",
      subtitle: "Red Carpet Kids, USA",
      description: "PLACEHOLDER: Please provide a description for this slide.",
      primaryButtonText: "Learn More",
      primaryButtonLink: "/lc-programs",
      imageUrl: "/images/programs/Welborn/CoachKWelborn.jpg"
    },
    {
      title: "Mentorship",
      subtitle: "Guidance for Growth",
      description: "Gain valuable life skills and career insights through our dedicated mentorship program.",
      primaryButtonText: "Learn More",
      primaryButtonLink: "/lc-programs",
      imageUrl: "/images/placeholder.jpg"
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: true,
    fade: true,
    cssEase: 'linear',
    className: 'transparent-slider',
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false
        }
      }
    ]
  };

  return (
    <>
      <section id="home" className="relative z-10 overflow-hidden">
        <Slider {...settings} className="hero-slider">
          {slides.map((slide, index) => (
            <HeroSlide key={index} slide={slide} index={index} />
          ))}
        </Slider>
      </section>
    </>
  );
};

export default Hero;
