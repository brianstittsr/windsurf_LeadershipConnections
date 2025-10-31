import SingleService from "@/components/Services/SingleService";
import servicesData from "@/components/Services/servicesData";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Leadership C.O.N.N.E.C.T.I.O.N.S.",
  description: "Discover our comprehensive services including mentoring, training demonstrations, and wellness programs designed to empower youth and build stronger communities.",
};

const ServicesPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Our Services"
        description="Explore our comprehensive range of services designed to empower youth, build skills, and strengthen communities through innovative programs and demonstrations."
      />

      <section className="py-16 md:py-20 lg:py-28 bg-white">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            {servicesData.map((service) => (
              <div
                key={service.id}
                className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
              >
                <SingleService service={service} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;
