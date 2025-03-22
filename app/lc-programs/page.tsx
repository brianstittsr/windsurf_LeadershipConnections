import Programs from "@/components/Programs";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LC Programs | Leadership C.O.N.N.E.C.T.I.O.N.S.",
  description: "Explore our leadership development programs designed to help you reach your full potential.",
};

const ProgramsPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="LC Programs"
        description="Discover our comprehensive leadership development programs designed to help individuals and organizations reach their full potential."
      />

      <Programs />
    </>
  );
};

export default ProgramsPage;
