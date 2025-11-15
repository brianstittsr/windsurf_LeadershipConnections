import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Involved | Leadership C.O.N.N.E.C.T.I.O.N.S.",
  description: "Get involved with Leadership C.O.N.N.E.C.T.I.O.N.S. and help us empower the next generation of leaders.",
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Get Involved"
        description="Are you passionate about making a difference? Join the Leadership Connections community!"
      />

      <Contact />
    </>
  );
};

export default ContactPage;
