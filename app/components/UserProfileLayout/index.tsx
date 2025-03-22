import { Heading } from "../../components copy";
import React from "react";

interface Props {
  className?: string;
  percentageText?: React.ReactNode;
}

export default function UserProfileLayout({ percentageText = "35%", ...props }: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex items-center w-[24%] md:w-full gap-2 p-1.5 bg-gray-100_01 rounded-[20px]`}
    >
      <div className="flex w-full flex-col items-start">
        <div className="h-[6px] w-[38px] rounded-[3px] bg-white-a700" />
        <div className="h-[8px] self-stretch rounded bg-white-a700" />
        <div className="mt-2 h-[8px] w-[32px] rounded bg-green-300" />
      </div>
      <div className="h-[52px] w-[52px] self-end rounded-[26px] bg-light_blue-a100">
        <Heading size="headingxl" as="p" className="text-center text-[15px] font-extrabold leading-5">
          {percentageText}
        </Heading>
      </div>
    </div>
  );
}
