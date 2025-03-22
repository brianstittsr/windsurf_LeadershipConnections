'use client';

import React from 'react';

interface HeroImageProps {
  src: string;
  alt: string;
}

const HeroImage: React.FC<HeroImageProps> = ({ src, alt }) => {
  return (
    <div className="hero-image-container h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl">
      <img 
        src={src} 
        alt={alt} 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          borderRadius: '0.5rem',
          display: 'block'
        }} 
        className="hero-image"
      />
    </div>
  );
};

export default HeroImage;
