'use client';

import React from 'react';

const About = () => {
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="wow fadeInUp" data-wow-delay=".2s">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4">
              <div className="mb-12 max-w-[570px] lg:mb-0">
                <h2 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-[40px]">
                  About Leadership C.O.N.N.E.C.T.I.O.N.S.
                </h2>
                <p className="mb-6 text-base text-body-color dark:text-dark-6">
                  At Leadership Connections, headquartered in Greensboro, NC, we are a multicultural educational organization committed to uplifting young women and men aged 14 to 17. Our journey began in 1991 when founder Kathy L. Harrelson envisioned a program to connect young women with the resources and support they need for empowerment and growth.
                </p>
                <h3 className="mb-4 text-2xl font-bold text-black dark:text-white sm:text-3xl md:text-[30px]">
                  Our Leadership Team
                </h3>
                <p className="mb-6 text-base text-body-color dark:text-dark-6">
                  Katherine L. Harrelson, Co-Founder, leads our passionate team with a wealth of experience and dedication to youth empowerment. Under her guidance, we foster a culture of mentorship, respect, and learning. Our diverse team includes skilled program directors and educators who are committed to creating meaningful experiences for our participants.
                </p>
                <h3 className="mb-4 text-2xl font-bold text-black dark:text-white sm:text-3xl md:text-[30px]">
                  Leadership Connection History
                </h3>
                <p className="mb-6 text-base text-body-color dark:text-dark-6">
                  Since its inception in 1991, Leadership Connections has continuously evolved to address the unique challenges faced by young women from disadvantaged backgrounds. Our pilot program, initially funded by the U.S. Department of Labor’s Women’s Bureau, has transformed the lives of over 5,486 graduates over the years[1].
                </p>
                <p className="text-base text-body-color dark:text-dark-6">
                  Our philosophy centers on hands-on learning and civic engagement, tailor-made to foster leadership skills and a positive self-image. Participating students not only learn critical life skills but also experience the power of community and interconnectedness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
