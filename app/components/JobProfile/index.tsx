import { Button } from "../Button";
import { Text } from "../Text";
import { Heading } from "../Heading";
import React from "react";

interface Props {
  className?: string;
  jobTitle?: React.ReactNode;
  location?: React.ReactNode;
  description?: React.ReactNode;
  applyButtonText?: string;
}

export default function JobProfile({
  jobTitle = "Web Designer & Developer",
  location,
  description = "It is a long established fact that a reader will be distracted by the readable content of a page from when looking at it layout. The point of using Lorem Ipsum looking at it layout.",
  applyButtonText = "Apply Now",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-start self-stretch gap-[30px] px-10 py-14 md:py-5 sm:p-4 flex-1 rounded-[30px]`}
    >
      <div className="ml-[26px] flex flex-col gap-[22px] self-stretch sm:ml-0 sm:gap-[22px]">
        <div className="flex flex-col items-start gap-1.5 sm:gap-1.5">
          <Heading as="h3" className="text-[30px] font-bold sm:text-[25px]">
            {jobTitle}
          </Heading>
          <Text size="text3xl" as="p" className="text-[20px] font-normal !text-gray-900_01 sm:text-[17px]">
            <span className="text-gray-900_01">San Francisco, CA | &nbsp;</span>
            <span className="text-deep_purple-a400">Full Time</span>
          </Text>
        </div>
        <Text as="p" className="text-[22px] font-normal leading-[157.4%] sm:text-[18px]">
          {description}
        </Text>
      </div>
      <Button
        color="gray_900_01"
        shape="round"
        className="mb-1 ml-[26px] min-w-[200px] rounded-[36px] px-[34px] font-bold sm:ml-0 sm:px-5"
      >
        {applyButtonText}
      </Button>
    </div>
  );
}
