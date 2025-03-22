import React from 'react';

const Mission: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Mission Statement Side */}
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              To equip young women with the necessary knowledge, skills,
              and leadership abilities to effect global progress for young
              women and girls.
            </p>
          </div>

          {/* Stylized Text Side */}
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="text-right">
                <span className="block text-6xl md:text-7xl lg:text-8xl font-dancing-script transform -rotate-6 text-black">
                  Strong
                </span>
                <span className="block text-6xl md:text-7xl lg:text-8xl font-dancing-script transform translate-y-[-1rem] text-black">
                  Women
                </span>
                <span className="absolute bottom-0 right-0 text-5xl font-dancing-script transform translate-y-2 text-black">
                  .
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
