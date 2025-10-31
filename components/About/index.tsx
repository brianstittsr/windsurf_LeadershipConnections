'use client';

import React from 'react';
import Image from 'next/image';
import { FaUserTie } from 'react-icons/fa';

const teamMembers = [
  {
    name: 'Katherine L. Harrelson',
    role: 'Co-Founder',
    imageUrl: '/images/hero/pexels-mikhail-nilov-9242836.jpg',
  },
  // Add more team members here
];

const About = () => {
  return (
    <>
      {/* Our Mission Section */}
      <section className="py-16 md:py-20 lg:py-28 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-body-color mb-6">Our Mission</h2>
              <p className="text-body-color mb-6 text-lg">
                At Leadership Connections, headquartered in Greensboro, NC, we are a multicultural educational organization committed to uplifting young women and men aged 14 to 17. Our journey began in 1991 when founder Kathy L. Harrelson envisioned a program to connect young women with the resources and support they need for empowerment and growth.
              </p>
            </div>
            <div className="relative h-80 w-full rounded-lg overflow-hidden">
              <Image
                src="/images/hero/pexels-vanessa-loring-7869077.jpg"
                alt="Our Mission"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Leadership Team Section */}
      <section className="py-16 md:py-20 lg:py-28 bg-secondary">
        <div className="container text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-body-color mb-12">Our Leadership Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-one text-center">
                <div className="relative h-32 w-32 mx-auto rounded-full overflow-hidden mb-4">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-serif text-xl font-bold text-body-color">{member.name}</h3>
                <p className="text-body-color">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Connection History Section */}
      <section className="py-16 md:py-20 lg:py-28 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-body-color mb-6 text-center">Our History</h2>
            <div className="prose prose-lg max-w-none text-body-color">
              <p>
                Since its inception in 1991, Leadership Connections has continuously evolved to address the unique challenges faced by young women from disadvantaged backgrounds. Our pilot program, initially funded by the U.S. Department of Labor’s Women’s Bureau, has transformed the lives of over 5,486 graduates over the years[1].
              </p>
              <p>
                Our philosophy centers on hands-on learning and civic engagement, tailor-made to foster leadership skills and a positive self-image. Participating students not only learn critical life skills but also experience the power of community and interconnectedness.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
