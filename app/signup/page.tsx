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
          <div className="w-full px-4">
            <Wizard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;
