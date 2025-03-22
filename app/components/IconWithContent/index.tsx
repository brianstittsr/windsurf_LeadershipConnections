import { Text, Heading, Img } from "../../components copy";
import React from "react";

interface Props {
  className?: string;
  iconImage?: string;
  titleText?: React.ReactNode;
  descriptionText?: React.ReactNode;
}

export default function IconWithContent({
  iconImage = "img_laptop.svg",
  titleText = "Innovation",
  descriptionText = "Long established fact that a readeed to will be distracted by the readable content of a page when looking at its layout",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex md:flex-col items-center w-full gap-10 px-[26px] py-9 sm:p-4 bg-gray-50_01 rounded-[30px]`}
    >
      <div className="w-[22%] rounded-[22px] bg-deep_purple-a200_07 px-[38px] py-11 md:py-5 sm:p-5">
        <Img src={iconImage} width={50} height={70} alt="Image" className="h-[70px] w-full sm:h-auto" />
      </div>
      <div className="flex flex-1 flex-col items-start gap-0.5 md:self-stretch sm:gap-0.5">
        <Heading as="h3" className="text-[30px] font-bold sm:text-[25px]">
          {titleText}
        </Heading>
        <Text as="p" className="w-full text-[22px] font-normal leading-[157.4%] sm:w-full sm:text-[18px]">
          {descriptionText}
        </Text>
      </div>
    </div>
  );
}
