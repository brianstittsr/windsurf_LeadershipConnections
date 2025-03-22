import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', showText = true }) => {
  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <div className="flex-shrink-0">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10"
        >
          <path
            d="M20 0L37.3205 10V30L20 40L2.67949 30V10L20 0Z"
            fill="#6366F1"
          />
          <path
            d="M18 12C18 10.8954 18.8954 10 20 10C21.1046 10 22 10.8954 22 12V28C22 29.1046 21.1046 30 20 30C18.8954 30 18 29.1046 18 28V12Z"
            fill="white"
          />
          <path
            d="M15 15C15 13.8954 15.8954 13 17 13C18.1046 13 19 13.8954 19 15V25C19 26.1046 18.1046 27 17 27C15.8954 27 15 26.1046 15 25V15Z"
            fill="white"
            fillOpacity="0.8"
          />
          <path
            d="M21 15C21 13.8954 21.8954 13 23 13C24.1046 13 25 13.8954 25 15V25C25 26.1046 24.1046 27 23 27C21.8954 27 21 26.1046 21 25V15Z"
            fill="white"
            fillOpacity="0.8"
          />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-bold leading-tight">Leadership</span>
          <span className="text-lg font-semibold tracking-wider text-indigo-600">
            C.O.N.N.E.C.T.I.O.N.S.
          </span>
        </div>
      )}
    </Link>
  );
};

export default Logo;
