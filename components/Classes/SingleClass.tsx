import { Class } from "@/types/class";
import Image from "next/image";
import Link from "next/link";

const SingleClass = ({ classItem }: { classItem: Class }) => {
  const { year, title, paragraph, image, graduationDate, tags, slug } = classItem;
  return (
    <>
      <div className="group relative overflow-hidden rounded-sm bg-white shadow-one duration-300 hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark">
        <Link
          href={`/lc-past-classes/${slug}`}
          className="relative block aspect-[37/22] w-full"
        >
          <Image src={image} alt={title} fill className="object-cover" />
        </Link>
        <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8">
          <h3>
            <Link
              href={`/lc-past-classes/${slug}`}
              className="mb-4 block text-xl font-bold text-body-color hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl"
            >
              {year}
            </Link>
          </h3>
          <p className="mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
            {paragraph}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-5 flex items-center border-r border-body-color border-opacity-10 pr-5 dark:border-white dark:border-opacity-10 xl:mr-3 xl:pr-3 2xl:mr-5 2xl:pr-5">
                <div className="w-full">
                  <p className="text-sm font-medium text-body-color">
                    Graduated: {graduationDate}
                  </p>
                </div>
              </div>
            </div>
            <div className="inline-block">
              {tags && tags.length > 0 && (
                <span className="inline-flex rounded-full bg-primary bg-opacity-10 px-4 py-2 text-sm font-medium text-primary">
                  {tags[0]}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleClass;
