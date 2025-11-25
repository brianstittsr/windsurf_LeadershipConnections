'use client';

import Image from 'next/image';

interface FormBrandingHeaderProps {
  variant?: 'full' | 'compact';
  showTagline?: boolean;
}

export default function FormBrandingHeader({ 
  variant = 'full', 
  showTagline = true 
}: FormBrandingHeaderProps) {
  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-r from-primary to-purple-600 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/images/logo/LeadershipConnectionsLogo.png"
              alt="Leadership Connections"
              width={60}
              height={60}
              className="object-contain"
              style={{ width: 'auto', height: '60px', maxWidth: '100%' }}
              priority
              unoptimized
            />
            <div>
              <h2 className="text-white font-bold text-lg">Leadership Connections</h2>
              {showTagline && (
                <p className="text-white/90 text-xs">
                  A program of the Women's Foundation of North Carolina
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary via-purple-600 to-primary py-8 px-6 shadow-lg">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-4">
          <Image
            src="/images/logo/LeadershipConnectionsLogo.png"
            alt="Leadership Connections"
            width={120}
            height={120}
            className="object-contain"
            style={{ width: 'auto', height: '120px', maxWidth: '100%' }}
            priority
            unoptimized
          />
        </div>
        <h1 className="text-white font-bold text-3xl mb-2">
          Leadership Connections
        </h1>
        {showTagline && (
          <p className="text-white/95 text-lg font-medium">
            A program of the Women's Foundation of North Carolina
          </p>
        )}
      </div>
    </div>
  );
}

export function FormBrandingFooter() {
  return (
    <div className="bg-gray-100 border-t border-gray-200 py-6 px-6 mt-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Image
            src="/images/logo/LeadershipConnectionsLogo.png"
            alt="Leadership Connections"
            width={40}
            height={40}
            className="object-contain"
            style={{ width: 'auto', height: '40px', maxWidth: '100%' }}
            unoptimized
          />
          <div className="text-left">
            <p className="text-gray-900 font-semibold text-sm">Leadership Connections</p>
            <p className="text-gray-600 text-xs">Women's Foundation of North Carolina</p>
          </div>
        </div>
        <p className="text-gray-500 text-xs">
          © {new Date().getFullYear()} Women's Foundation of North Carolina. All rights reserved.
        </p>
      </div>
    </div>
  );
}
