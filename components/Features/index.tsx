import SectionTitle from "../Common/SectionTitle";
import SingleFeature from "./SingleFeature";
import featuresData from "./featuresData";

const Features = () => {
  return (
    <>
      <section id="features" className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <SectionTitle
            title="Why Join the Leadership C.O.N.N.E.C.T.I.O.N.S. Program?"
            paragraph="Since 1991, the Leadership C.O.N.N.E.C.T.I.O.N.S. Program has empowered countless young women to realize their full potential and become confident leaders of tomorrow. Don't wait to start your journey—take the first step today!"
            center
          />

          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map((feature) => (
              <SingleFeature key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
