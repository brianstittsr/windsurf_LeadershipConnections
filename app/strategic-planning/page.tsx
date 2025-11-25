import Breadcrumb from "@/components/Common/Breadcrumb";
import StrategicPlanning from "@/components/StrategicPlanning";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Strategic Planning | Leadership Connections",
  description: "Explore proven brainstorming and strategic planning methods to unlock creativity and solve complex problems.",
};

const StrategicPlanningPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Strategic Planning"
        description="Discover powerful brainstorming techniques and strategic planning methods to drive innovation and achieve your goals."
      />
      <StrategicPlanning />
    </>
  );
};

export default StrategicPlanningPage;
