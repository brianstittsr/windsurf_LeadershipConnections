import { Text } from "../Text";
import { Heading } from "../Heading";
import React from "react";

interface Props {
  className?: string;
  primaryCounterText?: React.ReactNode;
  secondaryText?: React.ReactNode;
}

export default function UserProfile({ primaryCounterText = "Primary 1", secondaryText = "5236FF", ...props }: Props) {
  return (
    <div {...props} className={`${props.className} flex flex-col items-center w-[50%] md:w-full gap-4`}>
      <div className="h-[210px] w-[210px] rounded-[30px] bg-deep_purple-a400" />
      <div className="flex flex-col items-center">
        <Heading size="heading4xl" as="h5" className="text-[22px] font-bold">
          {primaryCounterText}
        </Heading>
        <Text as="p" className="text-[22px] font-normal">
          {secondaryText}
        </Text>
      </div>
    </div>
  );
}
