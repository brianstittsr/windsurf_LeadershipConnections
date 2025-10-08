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
  secondaryButtonText: string;
  secondaryButtonLink: string;
  bgColor: string;
  imageUrl?: string;
}

const slides: SlideProps[] = [
  {
    title: "2023-2024 Class Photo",
    subtitle: "Our Leadership Community",
    description: "Celebrating the achievements and growth of our 2023-2024 leadership class. Together, we've built connections, developed skills, and made a lasting impact in our communities.",
    primaryButtonText: "Join Our Community",
    primaryButtonLink: "/contact",
    secondaryButtonText: "View Programs",
    secondaryButtonLink: "/lc-programs",
    bgColor: "bg-gradient-to-r from-emerald-500 to-green-600",
    imageUrl: "/images/2023-2024ClassPhoto.jpg"
  },
  {
    title: "Leadership C.O.N.N.E.C.T.I.O.N.S.",
    subtitle: "Building Leaders for Tomorrow",
    description: "Leadership C.O.N.N.E.C.T.I.O.N.S. is dedicated to fostering leadership skills and building meaningful connections in communities. We provide resources, training, and networking opportunities to help you grow as a leader.",
    primaryButtonText: "Contact Us",
    primaryButtonLink: "/contact",
    secondaryButtonText: "Learn More",
    secondaryButtonLink: "/about",
    bgColor: "bg-gradient-to-r from-blue-500 to-purple-600",
    imageUrl: "/images/Leadership.png"
  },
  {
    title: "Community Outreach",
    subtitle: "Making a Difference Together",
    description: "Our community outreach programs connect leaders with local organizations to create meaningful impact. Join us in making a difference in your community through collaborative initiatives and volunteer opportunities.",
    primaryButtonText: "Join Now",
    primaryButtonLink: "/contact",
    secondaryButtonText: "Programs",
    secondaryButtonLink: "/about",
    bgColor: "bg-gradient-to-r from-green-500 to-teal-600",
    imageUrl: "/images/CoachKWelborn.png"
  },
  {
    title: "Professional Development",
    subtitle: "Grow Your Leadership Skills",
    description: "Enhance your professional capabilities with our specialized leadership development programs. From executive coaching to team-building workshops, we offer resources to help you reach your full potential.",
    primaryButtonText: "Explore Courses",
    primaryButtonLink: "/contact",
    secondaryButtonText: "Testimonials",
    secondaryButtonLink: "/about",
    bgColor: "bg-gradient-to-r from-orange-500 to-red-600",
    imageUrl: "/images/Leadership.png"
  },
  {
    title: "Networking Events",
    subtitle: "Connect with Like-minded Leaders",
    description: "Expand your professional network at our exclusive networking events. Meet industry leaders, potential mentors, and peers who share your passion for leadership and community development.",
    primaryButtonText: "Upcoming Events",
    primaryButtonLink: "/contact",
    secondaryButtonText: "Past Events",
    secondaryButtonLink: "/about",
    bgColor: "bg-gradient-to-r from-purple-500 to-indigo-600",
    imageUrl: "/images/RoboDogWelborn.png"
  },
  {
    title: "Mentorship Programs",
    subtitle: "Learn from the Best",
    description: "Our mentorship programs pair emerging leaders with experienced professionals. Gain valuable insights, personalized guidance, and support as you navigate your leadership journey.",
    primaryButtonText: "Find a Mentor",
    primaryButtonLink: "/contact",
    secondaryButtonText: "Become a Mentor",
    secondaryButtonLink: "/about",
    bgColor: "bg-gradient-to-r from-yellow-500 to-amber-600",
    imageUrl: "/images/MentorShip.jpg"
  },
  {
    title: "Leadership Resources",
    subtitle: "Tools for Success",
    description: "Access our comprehensive library of leadership resources, including articles, videos, podcasts, and research papers. Stay informed about the latest trends and best practices in leadership development.",
    primaryButtonText: "Browse Resources",
    primaryButtonLink: "/contact",
    secondaryButtonText: "Subscribe",
    secondaryButtonLink: "/about",
    bgColor: "bg-gradient-to-r from-cyan-500 to-blue-600",
    imageUrl: "/images/Leadership.png"
  }
];

const HeroSlide = ({ slide, index }: { slide: SlideProps; index: number }) => {
  return (
    <div className={`py-16 px-4 md:py-24 min-h-[600px] flex items-center bg-gradient-to-r animated-gradient ${index % 3 === 0 ? 'animated-gradient-fast' : index % 3 === 1 ? 'animated-gradient-slow' : 'animated-gradient'} ${slide.bgColor}`}>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="w-full md:w-1/2 text-white">
            <h2 className="text-xl md:text-2xl font-semibold mb-2">{slide.subtitle}</h2>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">{slide.title}</h1>
            <p className="text-base md:text-lg mb-8 opacity-90">{slide.description}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={slide.primaryButtonLink}
                className="rounded-md bg-white text-primary px-6 py-3 text-base font-semibold duration-300 ease-in-out hover:bg-opacity-90 text-center"
              >
                {slide.primaryButtonText}
              </Link>
              <Link
                href={slide.secondaryButtonLink}
                className="rounded-md bg-transparent border-2 border-white px-6 py-3 text-base font-semibold text-white duration-300 ease-in-out hover:bg-white hover:text-primary text-center"
              >
                {slide.secondaryButtonText}
              </Link>
            </div>
          </div>
          {slide.imageUrl ? (
            <div className="w-full md:w-1/2 mt-8 md:mt-0">
              <div className="h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl subtle-pulse">
                <Image 
                  src={slide.imageUrl} 
                  alt={slide.title} 
                  fill
                  className="object-cover rounded-lg"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
      <section
        id="home"
        className="dark:bg-gray-dark relative z-10 overflow-hidden bg-transparent"
      >
        {isClient ? (
          <Slider {...settings} className="hero-slider">
            {slides.map((slide, index) => (
              <HeroSlide key={index} slide={slide} index={index} />
            ))}
          </Slider>
        ) : (
          <HeroSlide slide={slides[0]} index={0} />
        )}
        <div className="absolute right-0 top-0 z-[-1] opacity-30 lg:opacity-100">
          <svg
            width="450"
            height="556"
            viewBox="0 0 450 556"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="277"
              cy="63"
              r="225"
              fill="url(#paint0_linear_25:217)"
            />
            <circle
              cx="17.9997"
              cy="182"
              r="18"
              fill="url(#paint1_radial_25:217)"
            />
            <circle
              cx="76.9997"
              cy="288"
              r="34"
              fill="url(#paint2_radial_25:217)"
            />
            <circle
              cx="325.486"
              cy="302.87"
              r="180"
              transform="rotate(-37.6852 325.486 302.87)"
              fill="url(#paint3_linear_25:217)"
            />
            <circle
              opacity="0.8"
              cx="184.521"
              cy="315.521"
              r="132.862"
              transform="rotate(114.874 184.521 315.521)"
              stroke="url(#paint4_linear_25:217)"
            />
            <circle
              opacity="0.8"
              cx="356"
              cy="290"
              r="179.5"
              transform="rotate(-30 356 290)"
              stroke="url(#paint5_linear_25:217)"
            />
            <circle
              opacity="0.8"
              cx="191.659"
              cy="302.659"
              r="133.362"
              transform="rotate(133.319 191.659 302.659)"
              fill="url(#paint6_linear_25:217)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_25:217"
                x1="-54.5003"
                y1="-178"
                x2="222"
                y2="288"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <radialGradient
                id="paint1_radial_25:217"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(17.9997 182) rotate(90) scale(18)"
              >
                <stop offset="0.145833" stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.08" />
              </radialGradient>
              <radialGradient
                id="paint2_radial_25:217"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(76.9997 288) rotate(90) scale(34)"
              >
                <stop offset="0.145833" stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.08" />
              </radialGradient>
              <linearGradient
                id="paint3_linear_25:217"
                x1="226.775"
                y1="-66.1548"
                x2="292.157"
                y2="351.421"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_25:217"
                x1="184.521"
                y1="182.159"
                x2="184.521"
                y2="448.882"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint5_linear_25:217"
                x1="356"
                y1="110"
                x2="356"
                y2="470"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint6_linear_25:217"
                x1="118.524"
                y1="29.2497"
                x2="166.965"
                y2="338.63"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 z-[-1] opacity-30 lg:opacity-100">
          <svg
            width="364"
            height="201"
            viewBox="0 0 364 201"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.88928 72.3303C33.6599 66.4798 101.397 64.9086 150.178 105.427C211.155 156.076 229.59 162.093 264.333 166.607C299.076 171.12 337.718 183.657 362.889 212.24"
              stroke="url(#paint0_linear_25:218)"
            />
            <path
              d="M-22.1107 72.3303C5.65989 66.4798 73.3965 64.9086 122.178 105.427C183.155 156.076 201.59 162.093 236.333 166.607C271.076 171.12 309.718 183.657 334.889 212.24"
              stroke="url(#paint1_linear_25:218)"
            />
            <path
              d="M-53.1107 72.3303C-25.3401 66.4798 42.3965 64.9086 91.1783 105.427C152.155 156.076 170.59 162.093 205.333 166.607C240.076 171.12 278.718 183.657 303.889 212.24"
              stroke="url(#paint2_linear_25:218)"
            />
            <path
              d="M-98.1618 65.0889C-68.1416 60.0601 4.73364 60.4882 56.0734 102.431C120.248 154.86 139.905 161.419 177.137 166.956C214.37 172.493 255.575 186.165 281.856 215.481"
              stroke="url(#paint3_linear_25:218)"
            />
            <circle
              opacity="0.8"
              cx="214.505"
              cy="60.5054"
              r="49.7205"
              transform="rotate(-13.421 214.505 60.5054)"
              stroke="url(#paint4_linear_25:218)"
            />
            <circle cx="220" cy="63" r="43" fill="url(#paint5_radial_25:218)" />
            <defs>
              <linearGradient
                id="paint0_linear_25:218"
                x1="184.389"
                y1="69.2405"
                x2="184.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_25:218"
                x1="156.389"
                y1="69.2405"
                x2="156.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_25:218"
                x1="125.389"
                y1="69.2405"
                x2="125.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_25:218"
                x1="93.8507"
                y1="67.2674"
                x2="89.9278"
                y2="210.214"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_25:218"
                x1="214.505"
                y1="10.2849"
                x2="212.684"
                y2="99.5816"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <radialGradient
                id="paint5_radial_25:218"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(220 63) rotate(90) scale(43)"
              >
                <stop offset="0.145833" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.08" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </section>
    </>
  );
};

export default Hero;
