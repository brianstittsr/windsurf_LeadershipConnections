import { Button, Heading, Img } from "../../components copy";
import Link from "next/link";
import React from "react";

interface Props {
  className?: string;
}

export default function Header({ ...props }: Props) {
  return (
    <header {...props} className={`${props.className} flex justify-between items-center gap-5`}>
      <Img
        src="img_header_logo.png"
        width={172}
        height={40}
        alt="Headerlogo"
        className="h-[40px] w-[172px] object-contain"
      />
      <div className="flex w-[66%] justify-center gap-10 md:w-full md:flex-col">
        <div className="flex flex-1 justify-center rounded-[36px] bg-gray-50_01 p-6 md:self-stretch sm:p-5">
          <ul className="flex flex-wrap gap-[50px]">
            <li>
              <Link href="#">
                <Heading size="text2xl" as="p" className="!font-poppins text-[18px] font-medium">
                  Home
                </Heading>
              </Link>
            </li>
            <li>
              <Link href="#">
                <Heading size="text2xl" as="p" className="!font-poppins text-[18px] font-medium">
                  About
                </Heading>
              </Link>
            </li>
            <li>
              <Link href="#">
                <Heading size="text2xl" as="p" className="!font-poppins text-[18px] font-medium">
                  Features 
                </Heading>
              </Link>
            </li>
            <li>
              <Link href="#">
                <Heading size="text2xl" as="p" className="!font-poppins text-[18px] font-medium">
                  Pages 
                </Heading>
              </Link>
            </li>
            <li>
              <Link href="#">
                <Heading size="text2xl" as="p" className="!font-poppins text-[18px] font-medium">
                  Blog
                </Heading>
              </Link>
            </li>
            <li>
              <Link href="#">
                <Heading size="text2xl" as="p" className="!font-poppins text-[18px] font-medium">
                  Contact
                </Heading>
              </Link>
            </li>
          </ul>
        </div>
        <Button shape="round" className="min-w-[166px] rounded-[36px] px-[34px] font-bold sm:px-5">
          Sign In
        </Button>
      </div>
    </header>
  );
}
