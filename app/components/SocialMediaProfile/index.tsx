import { Heading, Text, Img } from "../../components copy";
import React from "react";

interface Props {
  className?: string;
  arrowRightIcon?: string;
  facebookHeading?: React.ReactNode;
  socialDescription?: React.ReactNode;
  descriptionText?: React.ReactNode;
  viewIntegrationText?: React.ReactNode;
}

export default function SocialMediaProfile({
  arrowRightIcon = "img_arrow_right.svg",
  facebookHeading = "Facebook",
  socialDescription = "Social",
  descriptionText = "&lt;&gt;Contrary to popular belief, Lorem&lt;br /&gt;Ipsum is not simply random text.&lt;br /&gt;has roots in a piece.&lt;/&gt;",
  viewIntegrationText = "View Integration",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col w-full gap-[26px] px-[38px] py-[42px] md:py-5 sm:p-4 bg-gray-50_01 rounded-[30px]`}
    >
      <div className="flex items-start gap-[26px] self-stretch">
        <div className="flex w-[32%] flex-col items-center justify-center self-center rounded-[20px] bg-indigo-a200 p-8 sm:p-5">
          <Img src={arrowRightIcon} width={24} height={46} alt="Arrowrightimage" className="h-[46px]" />
        </div>
        <div className="mt-3 flex flex-1 flex-col items-start">
          <Heading as="h3" className="text-[30px] font-bold">
            {facebookHeading}
          </Heading>
          <Text as="p" className="text-[22px] font-normal">
            {socialDescription}
          </Text>
        </div>
      </div>
      <div className="mb-10 flex flex-col items-start gap-[30px] self-stretch">
        <Text as="p" className="text-[22px] font-normal leading-[157.4%]">
          {descriptionText}
        </Text>
        <Heading size="heading2xl" as="h6" className="text-[18px] font-bold underline">
          {viewIntegrationText}
        </Heading>
      </div>
    </div>
  );
}
