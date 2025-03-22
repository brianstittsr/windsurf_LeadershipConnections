import { Text } from "../Text";
import { Heading } from "../Heading";
import { Img } from "../Img";
import React from "react";

interface Props {
  className?: string;
  iconImage?: string;
  titleText?: React.ReactNode;
  emailText?: React.ReactNode;
}

export default function ContactInfo({
  iconImage = "img_lock_white_a700.svg",
  titleText = "Mail Us",
  emailText = "saasup@gmail.co",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex justify-center items-center w-[50%] md:w-full p-[34px] sm:p-4 border-gray-200_02 border border-solid bg-white-a700 shadow-sm rounded-[40px]`}
    >
      <div className="flex flex-1 items-center gap-[17px]">
        <div className="flex flex-col items-center justify-center rounded-[20px] bg-deep_purple-a100_01 px-[18px] py-[22px] sm:py-5">
          <Img src={iconImage} width={44} height={38} alt="Mail Us" className="h-[38px]" />
        </div>
        <Heading
          size="heading4xl"
          as="h5"
          className="text-[22px] font-bold capitalize !text-blue_gray-900 sm:text-[18px]"
        >
          {titleText}
        </Heading>
      </div>
      <Text as="p" className="text-[22px] font-normal lowercase sm:text-[18px]">
        {emailText}
      </Text>
    </div>
  );
}
