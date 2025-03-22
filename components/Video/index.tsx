"use client";

import SectionTitle from "../Common/SectionTitle";

const Video = () => {
  return (
    <section className="relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="Leadership in Action"
          paragraph="Watch our students demonstrate leadership, teamwork, and dedication in this showcase of talent and skill."
          center
          mb="80px"
        />

        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div
              className="wow fadeInUp mx-auto max-w-[770px] overflow-hidden rounded-md shadow-lg"
              data-wow-delay=".15s"
            >
              <div className="relative pb-[56.25%] h-0 overflow-hidden">
                <iframe 
                  className="absolute top-0 left-0 w-full h-full" 
                  width="770" 
                  height="433" 
                  src="https://www.youtube.com/embed/5ayz7WcEelc" 
                  title="Leadership in Action" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-[-1] h-full w-full bg-[url(/images/video/shape.svg)] bg-cover bg-center bg-no-repeat"></div>
    </section>
  );
};

export default Video;
