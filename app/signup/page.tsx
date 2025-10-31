import { Metadata } from "next";
import Wizard from "@/components/Signup/Wizard";

export const metadata: Metadata = {
  title: "Sign Up | Leadership C.O.N.N.E.C.T.I.O.N.S.",
  description: "Join Leadership C.O.N.N.E.C.T.I.O.N.S. and start your journey today.",
};

const SignupPage = () => {
  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          {/* Left Column - Welcome/Info */}
          <div className="w-full px-4 lg:w-1/3">
            <div className="mb-12 lg:mb-0">
              <h2 className="mb-6 text-3xl font-bold text-black dark:text-white sm:text-4xl">
                Join Our Community
              </h2>
              <p className="mb-6 text-base leading-relaxed text-body-color">
                Start your leadership journey with Leadership C.O.N.N.E.C.T.I.O.N.S. and unlock your potential through our comprehensive programs and mentorship opportunities.
              </p>
              <div className="mb-6">
                <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
                  What You'll Get:
                </h3>
                <ul className="space-y-2 text-body-color">
                  <li className="flex items-center">
                    <span className="mr-3 text-primary">✓</span>
                    Access to leadership development programs
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-primary">✓</span>
                    3-tier mentoring support system
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-primary">✓</span>
                    Community service opportunities
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-primary">✓</span>
                    College and career preparation
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Center Column - Signup Form */}
          <div className="w-full px-4 lg:w-1/3">
            <Wizard />
          </div>

          {/* Right Column - Additional Info */}
          <div className="w-full px-4 lg:w-1/3">
            <div className="mb-12 lg:mb-0">
              <div className="mb-8 rounded-lg bg-primary bg-opacity-10 p-6">
                <h3 className="mb-4 text-xl font-semibold text-primary">
                  Program Highlights
                </h3>
                <div className="space-y-4 text-sm text-body-color">
                  <div>
                    <h4 className="font-semibold text-black dark:text-white">Red Carpet Kids USA</h4>
                    <p>Fitness, arts, and wellness programs</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black dark:text-white">STEEM Academy</h4>
                    <p>Technology, robotics, and innovation</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black dark:text-white">College Experiences</h4>
                    <p>Campus visits and preparation programs</p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-6">
                <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
                  Need Help?
                </h3>
                <p className="mb-4 text-sm text-body-color">
                  Have questions about our programs or the registration process?
                </p>
                <div className="space-y-2 text-sm text-body-color">
                  <p>📧 Email: info@ncleadconnect.org</p>
                  <p>📞 Phone: Contact us for more information</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;
