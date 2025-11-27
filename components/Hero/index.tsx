'use client';

const Hero = () => {
  return (
    <section id="home" className="relative z-10 h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 -top-20">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-[calc(100%+5rem)] w-full object-cover"
          src="/videos/LeadershipConnectionsv3NoAud.mp4"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>
    </section>
  );
};

export default Hero;
