import { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "Leadership C.O.N.N.E.C.T.I.O.N.S.",
  description: "Leadership C.O.N.N.E.C.T.I.O.N.S. is dedicated to fostering leadership skills and building meaningful connections in communities.",
};

export default function Home() {
  return <HomeClient />;
}
