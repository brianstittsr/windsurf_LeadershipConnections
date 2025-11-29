"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter, Poppins } from "next/font/google";
import "node_modules/react-modal-video/css/modal-video.css";
import "../styles/index.css";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: '--font-poppins' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body className={`bg-secondary font-sans ${inter.variable} ${poppins.variable}`}>
        <AuthProvider>
          <Providers>
            <Header />
            <main className="pt-20">
              {children}
            </main>
            <Footer />
            <ScrollToTop />
            <RoleSwitcher />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}

import { Providers } from "./providers";
import { AuthProvider } from "@/context/AuthContext";
import RoleSwitcher from "@/components/Admin/RoleSwitcher";
