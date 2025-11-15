import Image from "next/image";
import Link from "next/link";

interface EventProps {
  id: number;
  slug: string;
  title: string;
  paragraph: string;
  image: string;
  date: string;
  location: string;
  tags: string[];
}

const SingleEvent = ({ event }: { event: EventProps }) => {
  const { title, image, paragraph, date, location, tags, slug } = event;
  return (
    <>
      <div
        className="wow fadeInUp group relative overflow-hidden rounded-lg bg-white shadow-one duration-300 hover:shadow-two"
        data-wow-delay=".1s"
      >
        <Link
          href={`/lc-past-events/${slug}`}
          className="relative block aspect-[37/22] w-full"
        >
          <span className="absolute right-6 top-6 z-20 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold capitalize text-white">
            {tags[0]}
          </span>
          <Image src={image} alt="image" fill className="object-cover" />
        </Link>
        <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8">
          <h3>
            <Link
              href={`/lc-past-events/${slug}`}
              className="mb-4 block font-serif text-xl font-bold text-body-color hover:text-primary sm:text-2xl"
            >
              {title}
            </Link>
          </h3>
          <p className="mb-6 border-b border-stroke pb-6 text-base font-medium text-body-color">
            {paragraph}
          </p>
          <div className="flex items-center">
            <div className="mr-5 flex items-center border-r border-stroke pr-5 xl:mr-3 xl:pr-3 2xl:mr-5 2xl:pr-5">
              <div className="w-full">
                <h4 className="mb-1 text-sm font-medium text-body-color">
                  Date
                </h4>
                <p className="text-xs text-body-color">{date}</p>
              </div>
            </div>
            <div className="inline-block">
              <h4 className="mb-1 text-sm font-medium text-body-color">
                Location
              </h4>
              <p className="text-xs text-body-color">{location}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleEvent;
