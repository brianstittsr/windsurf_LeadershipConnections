import { Program } from "@/types/program";
import Image from "next/image";
import Link from "next/link";

const SingleProgram = ({ program }: { program: Program }) => {
  const { title, paragraph, image, author, tags, publishDate, slug } = program;
  return (
    <>
      <div
        className="wow fadeInUp relative overflow-hidden rounded-lg bg-white shadow-one duration-300 hover:shadow-two"
        data-wow-delay=".1s"
      >
        <Link
          href={`/lc-programs/${slug}`}
          className="relative block h-[220px] w-full"
        >
          <span className="absolute top-6 right-6 z-20 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold capitalize text-white">
            {tags[0]}
          </span>
          <Image src={image} alt={title} fill className="object-cover object-center" />
        </Link>
        <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8">
          <h3>
            <Link
              href={`/lc-programs/${slug}`}
              className="mb-4 block font-serif text-xl font-bold text-body-color hover:text-primary sm:text-2xl"
            >
              {title}
            </Link>
          </h3>
          <p className="mb-6 text-base font-medium text-body-color">
            {paragraph}
          </p>
        </div>
      </div>
    </>
  );
};

export default SingleProgram;
