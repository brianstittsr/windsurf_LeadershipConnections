import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Leadership C.O.N.N.E.C.T.I.O.N.S.",
  description: "Learn about our mission, vision, and history at Leadership C.O.N.N.E.C.T.I.O.N.S.",
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="About Leadership C.O.N.N.E.C.T.I.O.N.S."
        description="A brief history about Leadership C.O.N.N.E.C.T.I.O.N.S."
      />
      <AboutSectionOne />
      <AboutSectionTwo />
    </>
  );
};

export default AboutPage;
