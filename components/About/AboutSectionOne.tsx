import Image from "next/image";
import SectionTitle from "../Common/SectionTitle";

const AboutSectionOne = () => {

  return (
    <section id="about" className="pt-16 md:pt-20 lg:pt-28">
      <div className="container">
        <div className="border-b border-body-color/[.15] pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-1/2">
              <SectionTitle
                title="Katherine Harrelson"
                paragraph=""
                mb="44px"
              />
              
              <div className="mb-8">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  Mission
                </h3>
                <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                  To Equip youth with the necessary knowledge, skills, and leadership abilities to effect global progress for youth and girls.
                </p>
              </div>
              
              <div className="mb-8">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  Vision
                </h3>
                <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                  To provide "World Class" training and advocacy that propels youth to achieve the highest level of Leadership.
                </p>
              </div>


            </div>

            <div className="w-full px-4 lg:w-1/2">
              <div
                className="wow fadeInUp relative mx-auto aspect-[25/24] max-w-[500px] lg:mr-0"
                data-wow-delay=".2s"
              >
                <Image
                  src="/images/logo/LeadershipConnectionsLogo.png"
                  alt="Leadership Connections logo"
                  fill
                  style={{ objectFit: 'contain' }}
                  className="drop-shadow-three mx-auto max-w-full dark:hidden dark:drop-shadow-none lg:mr-0"
                />
                <Image
                  src="/images/logo/LeadershipConnectionsLogo.png"
                  alt="Leadership Connections logo"
                  fill
                  style={{ objectFit: 'contain' }}
                  className="drop-shadow-three mx-auto hidden max-w-full dark:block dark:drop-shadow-none lg:mr-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionOne;
