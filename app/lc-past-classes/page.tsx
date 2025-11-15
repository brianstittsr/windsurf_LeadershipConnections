import Breadcrumb from "@/components/Common/Breadcrumb";
import SingleClass from "@/components/Classes/SingleClass";
import classesData from "@/components/Classes/classesData";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LC Past Classes | Leadership C.O.N.N.E.C.T.I.O.N.S.",
  description: "Explore the graduating classes of Leadership C.O.N.N.E.C.T.I.O.N.S. and celebrate the achievements of our young leaders.",
};

const LCPastClassesPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="LC Past Classes"
        description="Celebrating the achievements and legacy of Leadership C.O.N.N.E.C.T.I.O.N.S. graduating classes."
      />

      <section className="pb-[120px] pt-[120px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            {classesData.map((classItem) => (
              <div
                key={classItem.id}
                className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
              >
                <SingleClass classItem={classItem} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default LCPastClassesPage;
