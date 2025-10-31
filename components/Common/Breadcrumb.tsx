import Link from "next/link";

const Breadcrumb = ({
  pageName,
  description,
}: {
  pageName: string;
  description: string;
}) => {
  return (
    <>
      <section className="relative z-10 bg-secondary py-20 lg:py-28">
        <div className="container">
          <div className="text-center">
            <h1 className="mb-5 font-serif text-4xl font-bold text-body-color sm:text-5xl">
              {pageName}
            </h1>
            <p className="mx-auto max-w-3xl text-base font-medium leading-relaxed text-body-color">
              {description}
            </p>
            <div className="mt-6">
              <ul className="flex items-center justify-center gap-2">
                <li className="flex items-center">
                  <Link
                    href="/"
                    className="text-base font-medium text-body-color hover:text-primary"
                  >
                    Home
                  </Link>
                </li>
                <li className="text-base font-medium text-primary">/ {pageName}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Breadcrumb;
