import { Text, Heading } from "../../components copy";
import React from "react";

interface Props {
  className?: string;
  userName?: React.ReactNode;
  userBalance?: React.ReactNode;
}

export default function UserProfile2({ userName = "MJ", userBalance = "+$120.20", ...props }: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex items-center self-stretch gap-1.5 p-1.5 border-blue_gray-300_7f border border-solid bg-white-a700_7f flex-1 cursor-pointer rounded-[16px] hover:shadow-2xl`}
    >
      <div className="flex h-[20px] w-[20px] flex-col items-center justify-center rounded-[10px] bg-deep_orange-100_7f">
        <Heading
          size="headings"
          as="p"
          className="w-[72%] text-[8px] font-bold leading-[10px] tracking-[-0.08px] !text-red-a200"
        >
          {userName}
        </Heading>
      </div>
      <div className="flex flex-1 flex-col items-start justify-center">
        <div className="flex items-start justify-between gap-5 self-stretch">
          <div className="h-[6px] w-[44%] rounded-[3px] bg-gray-300_02" />
          <Text size="texts" as="p" className="self-center text-[8px] font-normal tracking-[-0.08px] !text-green-a700">
            {userBalance}
          </Text>
        </div>
        <div className="relative mt-[-2px] h-[2px] w-[38px] rounded-[1px] bg-gray-300_02" />
      </div>
    </div>
  );
}
