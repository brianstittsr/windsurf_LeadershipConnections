import { Button, Text, Heading } from "../../components copy";
import React from "react";

interface Props {
  className?: string;
  jobTitle?: React.ReactNode;
  location?: React.ReactNode;
  description?: React.ReactNode;
  applyNowText?: string;
}

export default function JobProfile1({
  jobTitle = "Web Designer & Developer",
  location,
  description = "It is a long established fact that a reader will be distracted by the readable. Lorem Ipsum looking at it layout.",
  applyNowText = "Apply Now",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-start w-full gap-16 px-[34px] py-14 md:py-5 sm:gap-8 sm:p-4 border-gray-400_04 border border-solid cursor-pointer rounded-[30px] hover:shadow-xs`}
    >
      <div className="mr-4 flex flex-col gap-[22px] self-stretch sm:mr-0 sm:gap-[22px]">
        <div className="flex flex-col items-start gap-1.5 sm:gap-1.5">
          <Heading as="h3" className="text-[30px] font-bold !text-white-a700 sm:text-[25px]">
            {jobTitle}
          </Heading>
          <Text size="text3xl" as="p" className="text-[20px] font-normal !text-white-a700 sm:text-[17px]">
            <span>San Francisco, CA | &nbsp;</span>
            <span>&nbsp;Part Time</span>
          </Text>
        </div>
        <Text as="p" className="text-[22px] font-normal leading-[157.4%] !text-white-a700 sm:text-[18px]">
          {description}
        </Text>
      </div>
      <Button
        color="white_A700"
        shape="round"
        className="mb-1 min-w-[164px] rounded-[36px] px-[34px] font-bold sm:px-5"
      >
        {applyNowText}
      </Button>
    </div>
  );
}
