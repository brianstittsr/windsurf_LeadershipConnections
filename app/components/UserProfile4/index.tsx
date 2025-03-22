import { Heading } from "../Heading";
import { Text } from "../Text";
import { Img } from "../Img";
import Link from "next/link";
import React from "react";

interface Props {
  className?: string;
  userIconImage?: string;
  integrationsText?: React.ReactNode;
  descriptionText?: React.ReactNode;
  learnMoreLink?: React.ReactNode;
}

export default function UserProfile4({
  userIconImage = "img_icon_blue_gray_50_224x320.svg",
  integrationsText = "20+ integrations",
  descriptionText = "Contrary to popular belief, Lore Ipsum is not simply random text. It has roots in a piece.",
  learnMoreLink = "Learn More",
  ...props
}: Props) {
  return (
    <div {...props} className={`${props.className} flex flex-col gap-[52px] sm:gap-[26px]`}>
      <Img src={userIconImage} width={320} height={224} alt="Icon" className="mx-8 h-[224px] w-full" />
      <div className="flex flex-col items-center gap-11 self-stretch">
        <div className="flex flex-col items-center gap-3.5 self-stretch">
          <Heading as="h3" className="text-[30px] font-bold">
            {integrationsText}
          </Heading>
          <Text as="p" className="self-stretch text-center text-[22px] font-normal leading-[157.4%]">
            {descriptionText}
          </Text>
        </div>
        <Link href="#">
          <Heading size="heading2xl" as="h6" className="text-[18px] font-bold underline">
            {learnMoreLink}
          </Heading>
        </Link>
      </div>
    </div>
  );
}
