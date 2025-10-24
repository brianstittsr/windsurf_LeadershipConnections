import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Support | Leadership C.O.N.N.E.C.T.I.O.N.S.",
  description: "Get in touch with Leadership C.O.N.N.E.C.T.I.O.N.S. and support our mission to empower young women leaders through donations.",
  // other metadata
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Contact & Support"
        description="Get in touch with us or support our mission to empower young women leaders through your generous donation."
      />

      <Contact />
    </>
  );
};

export default ContactPage;
