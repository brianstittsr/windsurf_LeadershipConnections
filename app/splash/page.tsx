'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/SplashScreen';

export default function SplashPage() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  const handleComplete = () => {
    setShowSplash(false);
    router.push('/');
  };

  // Automatically redirect after 10 seconds (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      handleComplete();
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleComplete} />}
    </>
  );
}
