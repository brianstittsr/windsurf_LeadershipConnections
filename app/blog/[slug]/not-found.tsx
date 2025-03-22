import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative z-10 pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
      <div className="container">
        <div className="flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto max-w-[530px] text-center">
              <div className="mx-auto mb-9 text-center">
                <svg
                  className="mx-auto w-full text-center"
                  height="210"
                  viewBox="0 0 474 210"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.5"
                    d="M25 163.051H101.211V191H133.308V163.051H153V136.111H133.308V32H91.2871L25 136.577V163.051ZM101.831 136.111H58.8025V134.869L100.591 68.6445H101.831V136.111Z"
                    fill="url(#paint0_linear_116:1137)"
                  />
                  <path
                    opacity="0.5"
                    d="M307 191H473V163.051H375.931V32H307V191Z"
                    fill="url(#paint1_linear_116:1137)"
                  />
                  <path
                    opacity="0.5"
                    d="M204.715 191H273.334V99.8223L328.362 191H405V32H336.381V121.932L282.619 32H204.715V191Z"
                    fill="url(#paint2_linear_116:1137)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_116:1137"
                      x1="25"
                      y1="183"
                      x2="153"
                      y2="32"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#4A6CF7" />
                      <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_116:1137"
                      x1="307"
                      y1="183"
                      x2="473"
                      y2="32"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#4A6CF7" />
                      <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient
                      id="paint2_linear_116:1137"
                      x1="204.715"
                      y1="183"
                      x2="405"
                      y2="32"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#4A6CF7" />
                      <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl">
                Blog Post Not Found
              </h3>
              <p className="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                The blog post you are looking for doesn't exist or has been moved.
              </p>
              <Link
                href="/"
                className="rounded-md bg-primary px-8 py-3 text-base font-bold text-white shadow-signUp duration-300 hover:bg-white hover:text-primary md:px-9 lg:px-8 xl:px-9"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
