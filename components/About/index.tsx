'use client';

import React from 'react';
import Image from 'next/image';
import { FaUserTie } from 'react-icons/fa';

const teamMembers = [
  {
    name: 'Katherine L. Harrelson',
    role: 'Founder & Executive Director',
    imageUrl: '/images/history/Katherine_Harrelson.png',
  },
  {
    name: 'Meg Stern',
    role: 'Board Member',
    imageUrl: '/images/history/meg-sternerg.jpg',
  },
  {
    name: 'Board Member',
    role: 'Advisory Board',
    imageUrl: '/images/history/screen-shot-2017-08-10-at-2-11-29-pm_orig.png',
  },
  {
    name: 'Board Member',
    role: 'Advisory Board',
    imageUrl: '/images/history/screen-shot-2017-08-10-at-2-13-50-pm_orig.png',
  },
  {
    name: 'Board Member',
    role: 'Advisory Board',
    imageUrl: '/images/history/screen-shot-2017-08-10-at-2-14-50-pm_orig.png',
  },
  {
    name: 'Board Member',
    role: 'Advisory Board',
    imageUrl: '/images/history/screen-shot-2017-08-10-at-2-15-29-pm_orig.png',
  },
  {
    name: 'Board Member',
    role: 'Advisory Board',
    imageUrl: '/images/history/screen-shot-2017-08-10-at-2-16-25-pm_orig.png',
  },
  {
    name: 'Board Member',
    role: 'Advisory Board',
    imageUrl: '/images/history/screen-shot-2017-08-10-at-2-33-07-pm_orig.png',
  },
  {
    name: 'Board Member',
    role: 'Advisory Board',
    imageUrl: '/images/history/screen-shot-2017-08-10-at-2-38-22-pm_orig.png',
  },
  {
    name: 'Board Member',
    role: 'Advisory Board',
    imageUrl: '/images/history/screen-shot-2017-08-10-at-2-38-45-pm_orig.png',
  },
  {
    name: 'Board Member',
    role: 'Advisory Board',
    imageUrl: '/images/history/screen-shot-2017-08-10-at-2-39-58-pm_orig.png',
  },
];

const About = () => {
  return (
    <>
      {/* History of Leadership C.O.N.N.E.C.T.I.O.N.S. Section */}
      <section className="py-16 md:py-20 lg:py-28 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-6">History of Leadership C.O.N.N.E.C.T.I.O.N.S.</h2>
              <p className="text-body-color mb-4 text-base leading-relaxed">
                Leadership Connections, Inc. was founded in 1991 by Kathy Harrelson, who envisioned a program dedicated to empowering young women, particularly those from historically marginalized backgrounds. The initiative aimed to recruit, mentor, and support girls aged 14-17, providing them with access to leadership development opportunities that had traditionally been unavailable to them.
              </p>
              <h3 className="font-semibold text-xl text-primary-600 dark:text-primary-400 mb-3 mt-6">Initial Funding and Development</h3>
              <p className="text-body-color mb-4 text-base leading-relaxed">
                The program began with funding from the Women's Bureau of the U.S. Department of Labor, which recognized the need for targeted support for young women in North Carolina. This initial financial backing allowed Leadership Connections to establish itself as a pioneering model for comprehensive educational services.
              </p>
              <h3 className="font-semibold text-xl text-primary-600 dark:text-primary-400 mb-3 mt-6">Growth and Expansion</h3>
              <p className="text-body-color mb-4 text-base leading-relaxed">
                Over the years, Leadership Connections has evolved into a statewide educational program that has successfully graduated over 5,486 young women. The program has adapted its curriculum to include a variety of innovative modules, including leadership training, civic responsibility, and career preparation, all aimed at fostering self-esteem, confidence, and community engagement.
              </p>
              <h3 className="font-semibold text-xl text-primary-600 dark:text-primary-400 mb-3 mt-6">Mentorship and Community Impact</h3>
              <p className="text-body-color mb-4 text-base leading-relaxed">
                A key component of Leadership Connections is its three-tier mentoring system, which includes career mentoring from diverse professionals, peer mentoring from program alumni, and intergenerational mentoring that fosters dialogue between generations. This holistic approach has not only equipped participants with essential skills but has also created a supportive network that encourages ongoing personal and professional development.
              </p>
              <h3 className="font-semibold text-xl text-primary-600 dark:text-primary-400 mb-3 mt-6">Recognition and Legacy</h3>
              <p className="text-body-color mb-4 text-base leading-relaxed">
                Leadership Connections has received accolades for its innovative approach to youth development and empowerment. The program's impact is evident in the high percentage of graduates who pursue higher education, with 82% of alumni obtaining college degrees. The establishment of the Katherine L. Harrelson Endowment Scholarship Fund further underscores the program's commitment to supporting future generations of young women.
              </p>
              <h3 className="font-semibold text-xl text-primary-600 dark:text-primary-400 mb-3 mt-6">Conclusion</h3>
              <p className="text-body-color mb-4 text-base leading-relaxed">
                Today, Leadership Connections continues to serve as a vital resource for young women in North Carolina, adapting to the changing needs of its participants while remaining true to its original mission of empowerment and leadership development. The program stands as a testament to the power of mentorship and community support in shaping the leaders of tomorrow.
              </p>
            </div>
            <div className="relative h-[600px] w-full rounded-lg overflow-hidden">
              <Image
                src="/images/history/Katherine_Harrelson.png"
                alt="Katherine Harrelson - Founder"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The C.O.N.N.E.C.T.I.O.N.S. Meaning Section */}
      <section className="py-16 md:py-20 lg:py-28 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] w-full rounded-lg overflow-hidden">
              <Image
                src="/images/cellphone_images/8374467173046807092.jpg"
                alt="Original C.O.N.N.E.C.T.I.O.N.S. Acronym"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-6">The C.O.N.N.E.C.T.I.O.N.S. Meaning</h2>
              <p className="text-body-color mb-6 text-base leading-relaxed">
                The acronym C.O.N.N.E.C.T.I.O.N.S. holds deep significance in our organization's history and mission. Originally conceived as a program specifically designed for young women, each letter of our name represents a core value that has guided our work since our founding in 1991.
              </p>
              <p className="text-body-color mb-6 text-base leading-relaxed">
                When Katherine Harrelson founded Leadership Connections, she envisioned a comprehensive program that would address the unique challenges and opportunities facing young women, particularly those from underserved communities. The C.O.N.N.E.C.T.I.O.N.S. framework was developed to create meaningful pathways for girls to develop leadership skills, build confidence, and establish lasting relationships that would support their personal and professional growth.
              </p>
              <p className="text-body-color mb-6 text-base leading-relaxed">
                Each component of the C.O.N.N.E.C.T.I.O.N.S. model was carefully crafted to address specific developmental needs of adolescent girls. The program recognized that young women often face unique societal pressures and barriers, and sought to create an empowering environment where they could explore their potential, develop their voices, and build the skills necessary to become effective leaders in their communities.
              </p>
              <p className="text-body-color mb-4 text-base leading-relaxed">
                While our program has evolved over the years to serve a broader population, the foundational principles embedded in the C.O.N.N.E.C.T.I.O.N.S. acronym continue to guide our mission. These core values remain as relevant today as they were when we first began, serving as a testament to the enduring importance of intentional, values-based youth development programming.
              </p>
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
    </>
  );
};

export default About;
