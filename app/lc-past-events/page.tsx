import SingleEvent from "@/components/Events/SingleEvent";
import eventsData from "@/components/Events/eventsData";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LC Past Events | Leadership C.O.N.N.E.C.T.I.O.N.S.",
  description: "Explore past events and activities from Leadership C.O.N.N.E.C.T.I.O.N.S.",
};

const LCPastEventsPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="LC Past Events"
        description="Explore past events and activities from Leadership C.O.N.N.E.C.T.I.O.N.S. - celebrating our community impact and memorable moments."
      />

      <section className="py-16 md:py-20 lg:py-28 bg-white">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            {eventsData.map((event) => (
              <div
                key={event.id}
                className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
              >
                <SingleEvent event={event} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default LCPastEventsPage;
