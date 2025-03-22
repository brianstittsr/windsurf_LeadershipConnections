'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './splash-screen.css';
import './bootstrap-grid.css';

// Import images directly
import shape1 from '../../public/appear-free/assets/img/shape-1.svg';
import shape2 from '../../public/appear-free/assets/img/shape-2.svg';
import shape3 from '../../public/appear-free/assets/img/shape-3.svg';
import shape4 from '../../public/appear-free/assets/img/shape-4.svg';
import shape5 from '../../public/appear-free/assets/img/shape-5.svg';
import shape6 from '../../public/appear-free/assets/img/shape-6.svg';
import img1 from '../../public/appear-free/assets/img/img-1.svg';

interface SplashScreenProps {
  onComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onComplete
}) => {
  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    const countdownTimer = () => {
      // Set days to 0 and hours to 8 statically
      setDays(0);
      setHours(8);
      
      // Only calculate minutes and seconds dynamically
      const now = new Date();
      const seconds = 59 - now.getSeconds();
      const minutes = 59 - now.getMinutes();
      
      setMinutes(minutes);
      setSeconds(seconds);
    };

    const interval = setInterval(countdownTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission - could connect to an API or email service
    console.log('Email submitted:', email);
    setEmail('');
    // You could trigger the onComplete callback here if needed
  };

  return (
    <main className="splash-screen-main">
      <div className="splash-screen-wrapper">
        {/* Shapes */}
        <div className="splash-screen-shapes">
          <Image src={shape1} alt="" className="shape shape-1" width={50} height={50} priority />
          <Image src={shape2} alt="" className="shape shape-2" width={50} height={50} priority />
          <Image src={shape3} alt="" className="shape shape-3" width={50} height={50} priority />
          <Image src={shape4} alt="" className="shape shape-4" width={50} height={50} priority />
          <Image src={shape5} alt="" className="shape shape-5" width={50} height={50} priority />
          <Image src={shape6} alt="" className="shape shape-6" width={50} height={50} priority />
        </div>

        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-5 col-lg-6 col-md-6">
              {/* Image wrapper */}
              <div className="img-wrapper wow fadeInLeft" data-wow-delay=".2s">
                <Image 
                  src={img1} 
                  alt="Leadership C.O.N.N.E.C.T.I.O.N.S. Coming Soon" 
                  width={500} 
                  height={500} 
                  priority
                />
              </div>
            </div>
            <div className="col-xl-7 col-lg-6 col-md-6 odd-col">
              {/* Content wrapper */}
              <div className="content-wrapper">
                {/* Logo container */}
                <div className="logo-container wow fadeInDown" data-wow-delay=".1s" style={{ marginBottom: '20px', textAlign: 'center' }}>
                  <Image 
                    src="/images/logo/LeadershipConnectionsLogo.png" 
                    alt="Leadership C.O.N.N.E.C.T.I.O.N.S. Logo" 
                    width={150} 
                    height={75} 
                    className="logo-image"
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>
                <h1 className="wow fadeInDown" data-wow-delay=".2s">Coming Soon</h1>
                <p className="wow fadeInUp" data-wow-delay=".4s">
                  Leadership C.O.N.N.E.C.T.I.O.N.S. is launching soon. Join our waiting list to be the first to know when we go live.
                </p>

                {/* Countdown */}
                <div className="countdown-wrapper wow fadeInLeft" data-wow-delay=".2s">
                  <div className="countdown-item">
                    <span className="number">{days}</span>
                    <span className="text">Days</span>
                  </div>
                  <div className="countdown-item">
                    <span className="number">{hours}</span>
                    <span className="text">Hours</span>
                  </div>
                  <div className="countdown-item">
                    <span className="number">{minutes}</span>
                    <span className="text">Minutes</span>
                  </div>
                  <div className="countdown-item">
                    <span className="number">{seconds}</span>
                    <span className="text">Seconds</span>
                  </div>
                </div>

                {/* Subscribe form - hidden */}
                <form 
                  className="subscribe-form wow fadeInDown" 
                  data-wow-delay=".6s"
                  onSubmit={handleSubmit}
                  style={{ display: 'none' }}
                >
                  <input 
                    type="email" 
                    className="required email"
                    placeholder="Enter Mail Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="sub_btn common-btn">
                    Join Waiting List
                  </button>
                </form>

                {/* Hidden skip button - functionality remains but text is hidden */}
                {onComplete && (
                  <div className="skip-button-wrapper" style={{ display: 'none' }}>
                    <button onClick={onComplete} className="skip-button">
                      Skip to Website
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SplashScreen;
