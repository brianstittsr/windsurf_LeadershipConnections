import { Heading, Text, Button, Img } from "../../components copy";
import Link from "next/link";
import React from "react";

interface Props {
  className?: string;
  userImage?: string;
  marketingButtonText?: string;
  analysisButtonText?: string;
  dateText?: React.ReactNode;
  titleText?: React.ReactNode;
  descriptionText?: React.ReactNode;
  readMoreLink?: React.ReactNode;
}

export default function UserProfile3({
  userImage = "img_photo_338x596.png",
  marketingButtonText = "Marketing",
  analysisButtonText = "Analysis",
  dateText = "November 15, 2022",
  titleText = "&lt;&gt;10 Top tips for making your&lt;br /&gt;Saas product sticky&lt;/&gt;",
  descriptionText = "It is a long established fact that a reader will be distracted by the readable content of a page from when looking at it layout. The point of using Lorem Ipsum",
  readMoreLink = "Read More",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col w-[50%] md:w-full gap-[46px] p-10 sm:p-4 bg-gray-50_01 rounded-[50px]`}
    >
      <div className="relative h-[338px] content-center self-stretch sm:h-auto">
        <Img
          src={userImage}
          width={596}
          height={338}
          alt="Dynamicimage"
          className="h-[338px] w-full flex-1 rounded-[40px] object-cover"
        />
        <div className="absolute bottom-[21px] left-0 right-0 mx-[18px] flex flex-1 gap-[11px] sm:mx-0">
          <Button
            color="white_A700"
            size="lg"
            className="min-w-[166px] rounded-[26px] px-[34px] font-bold capitalize sm:px-5"
          >
            {marketingButtonText}
          </Button>
          <Button
            color="white_A700"
            size="lg"
            className="min-w-[166px] rounded-[26px] px-[34px] font-bold capitalize sm:px-5"
          >
            {analysisButtonText}
          </Button>
        </div>
      </div>
      <div className="mb-5 flex flex-col gap-4 self-stretch sm:gap-4">
        <div className="flex flex-col items-start gap-[18px] sm:gap-[18px]">
          <Heading size="text2xl" as="p" className="text-[18px] font-normal !text-gray-600 sm:text-[15px]">
            {dateText}
          </Heading>
          <Heading size="heading9xl" as="h1" className="text-[40px] font-extrabold leading-[123%] sm:text-[34px]">
            {titleText}
          </Heading>
        </div>
        <div className="flex flex-col items-start gap-[38px] sm:gap-[38px]">
          <Text as="p" className="w-full text-[22px] font-normal leading-[157.4%] sm:w-full sm:text-[18px]">
            {descriptionText}
          </Text>
          <Link href="#" className="sm:text-[15px]">
            <Heading size="heading2xl" as="h6" className="text-[18px] font-bold !text-deep_purple-a400 underline">
              {readMoreLink}
            </Heading>
          </Link>
        </div>
      </div>
    </div>
  );
}
