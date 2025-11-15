import { Metadata } from "next";
import Image from "next/image";
import { getEventBySlug, getAllEvents } from "@/lib/eventUtils";
import { notFound } from "next/navigation";
import TagButton from "@/components/Blog/TagButton";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const event = getEventBySlug(params.slug);
  
  if (!event) {
    return {
      title: "Event Not Found",
      description: "The requested event could not be found",
    };
  }

  return {
    title: `${event.title} | Leadership C.O.N.N.E.C.T.I.O.N.S.`,
    description: event.paragraph,
  };
}

export async function generateStaticParams() {
  const events = getAllEvents();
  return events.map((event) => ({
    slug: event.slug,
  }));
}

const EventDetailsPage = ({ params }: { params: { slug: string } }) => {
  const event = getEventBySlug(params.slug);

  if (!event) {
    notFound();
  }

  return (
    <>
      <section className="pb-[120px] pt-[150px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 lg:w-8/12">
              <div>
                <h2 className="mb-8 text-3xl font-bold leading-tight text-primary-600 dark:text-primary-400 sm:text-4xl sm:leading-tight">
                  {event.title}
                </h2>
                <div className="mb-10 flex flex-wrap items-center justify-between border-b border-body-color border-opacity-10 pb-4 dark:border-white dark:border-opacity-10">
                  <div className="flex flex-wrap items-center">
                    <div className="mb-5 mr-10 flex items-center">
                      <div className="w-full">
                        <h4 className="mb-1 text-base font-medium text-body-color">
                          Date
                        </h4>
                        <p className="text-sm text-body-color">
                          {event.date}
                        </p>
                      </div>
                    </div>
                    <div className="mb-5 flex items-center">
                      <p className="mr-5 flex items-center text-base font-medium text-body-color">
                        <span className="mr-3">
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            className="fill-current"
                          >
                            <path d="M7.5 0C5.01 0 3 2.01 3 4.5c0 3.38 4.5 10.5 4.5 10.5S12 7.88 12 4.5C12 2.01 9.99 0 7.5 0zm0 6.75c-1.24 0-2.25-1.01-2.25-2.25S6.26 2.25 7.5 2.25s2.25 1.01 2.25 2.25S8.74 6.75 7.5 6.75z"/>
                          </svg>
                        </span>
                        {event.location}
                      </p>
                    </div>
                  </div>
                  <div className="mb-5">
                    <TagButton text={event.tags[0]} />
                  </div>
                </div>
                <div>
                  <div className="mb-10 w-full overflow-hidden rounded">
                    <div className="relative aspect-[97/60] w-full sm:aspect-[97/44]">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                  </div>

                  <div className="blog-details">
                    <div dangerouslySetInnerHTML={{ __html: event.content }} />
                  </div>

                  <div className="mt-12 flex flex-wrap items-center justify-between">
                    <div className="mb-5">
                      <h5 className="mb-3 text-sm font-medium text-body-color sm:text-right">
                        Tags:
                      </h5>
                      <div className="flex items-center sm:justify-end">
                        {event.tags.map((tag, index) => (
                          <TagButton key={index} text={tag} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EventDetailsPage;
