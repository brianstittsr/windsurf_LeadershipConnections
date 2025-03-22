import { Text, Heading, Img } from "../../components copy";
import React from "react";

interface Props {
  className?: string;
  iconImage?: string;
  titleText?: React.ReactNode;
  descriptionText?: React.ReactNode;
}

export default function UserProfileCard({
  iconImage = "img_thumbs_up_white_a700.svg",
  titleText = "Patients come first",
  descriptionText = "Contrary to popular belief, Ipsum is not simply random text. It has roots in a piece.",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-start w-full gap-7 px-[50px] py-[52px] md:p-5 sm:p-4 border-gray-100_02 border border-solid bg-white-a700 shadow-md rounded-[40px]`}
    >
      <div className="w-[32%] rounded-[30px] bg-purple-100 px-8 py-7 sm:p-5">
        <Img src={iconImage} width={48} height={58} alt="Iconimage" className="h-[58px] w-full" />
      </div>
      <div className="flex flex-col items-start gap-3 self-stretch">
        <Heading as="h3" className="text-[30px] font-bold">
          {titleText}
        </Heading>
        <Text as="p" className="w-full text-[22px] font-normal leading-[157.4%]">
          {descriptionText}
        </Text>
      </div>
    </div>
  );
}
