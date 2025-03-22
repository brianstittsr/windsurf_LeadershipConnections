import { Text, Heading } from "../../components copy";
import React from "react";

interface Props {
  className?: string;
  secondaryCounterText?: React.ReactNode;
  zipcodeText?: React.ReactNode;
}

export default function UserProfile1({
  secondaryCounterText = "Secondary 3",
  zipcodeText = "242331",
  ...props
}: Props) {
  return (
    <div {...props} className={`${props.className} flex flex-col items-center w-[32%] md:w-full gap-4`}>
      <div className="h-[210px] w-[210px] rounded-[30px] bg-gray-900_01" />
      <div className="mx-[42px] flex flex-col items-center self-stretch">
        <Heading size="heading4xl" as="h5" className="text-[22px] font-bold">
          {secondaryCounterText}
        </Heading>
        <Text as="p" className="text-[22px] font-normal">
          {zipcodeText}
        </Text>
      </div>
    </div>
  );
}
