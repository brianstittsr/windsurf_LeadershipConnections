import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Leadership C.O.N.N.E.C.T.I.O.N.S.",
  description: "Learn more about the services we offer.",
};

const ServicesPage = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        <h1 className="text-3xl font-bold text-center">Our Services</h1>
        <p className="text-center mt-4">Information about the services we offer will be available here soon.</p>
      </div>
    </section>
  );
};

export default ServicesPage;
