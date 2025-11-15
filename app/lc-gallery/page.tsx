'use client';

import Breadcrumb from "@/components/Common/Breadcrumb";
import Image from "next/image";
import { useState, useEffect } from "react";

const galleryImages = [
  "/images/gallery/464921365_8978168748884412_3823588072331833648_n.png",
  "/images/gallery/505231388_24193579450250094_5460010326890634795_n.jpg",
  "/images/gallery/505314035_24193579536916752_5255185080022799108_n.jpg",
  "/images/gallery/505510158_24193579300250109_5985072053764740578_n.jpg",
  "/images/gallery/505764025_24193579423583430_6670009325393755645_n.jpg",
  "/images/gallery/506178651_24193579430250096_7969424348057084712_n.jpg",
  "/images/gallery/506807093_24193579323583440_4567759477534170102_n.jpg",
  "/images/gallery/510746879_24284250357849669_2255068570129778545_n.jpg",
  "/images/gallery/514455323_24340215798919791_7252398168141571953_n.jpg",
];

const LCGalleryPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <>
      <Breadcrumb
        pageName="LC Gallery"
        description="Explore moments and memories from Leadership C.O.N.N.E.C.T.I.O.N.S. programs and events."
      />

      <section className="py-16 md:py-20 lg:py-28 bg-white">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-8 text-center">
              Photo Gallery
            </h2>
            
            <p className="text-body-color text-base leading-relaxed mb-12 text-center max-w-3xl mx-auto">
              Take a visual journey through our programs, events, and the incredible moments 
              that define Leadership C.O.N.N.E.C.T.I.O.N.S. These images capture the spirit 
              of learning, growth, and community that makes our organization special.
            </p>

            {/* Carousel Container */}
            <div className="relative">
              {/* Main Image Display */}
              <div className="relative w-full aspect-[16/10] overflow-hidden rounded-lg bg-gray-100 shadow-two">
                <Image
                  src={galleryImages[currentIndex]}
                  alt={`Gallery image ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  priority
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-300"
                  aria-label="Previous image"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-300"
                  aria-label="Next image"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
                  {currentIndex + 1} / {galleryImages.length}
                </div>
              </div>

              {/* Thumbnail Navigation */}
              <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
                {galleryImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      index === currentIndex
                        ? "border-primary-600 ring-2 ring-primary-400"
                        : "border-gray-300 hover:border-primary-400"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Auto-play Toggle */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-300"
                >
                  {isAutoPlaying ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                      Pause Slideshow
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Play Slideshow
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LCGalleryPage;
