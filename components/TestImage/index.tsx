'use client';

import React from 'react';

const TestImage = () => {
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Test Image Component</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Regular IMG tag (leadersoftomorrow.jpg)</h3>
          <div className="h-[300px] rounded-lg overflow-hidden">
            <img 
              src="/public/images/meg-sternerg.jpg" 
              alt="Leaders of Tomorrow" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
              }} 
            />
          </div>
        </div>
        
        <div className="border p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Regular IMG tag (community-2.jpg)</h3>
          <div className="h-[300px] rounded-lg overflow-hidden">
            <img 
              src="/images/hero/community-2.jpg" 
              alt="Community" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestImage;
