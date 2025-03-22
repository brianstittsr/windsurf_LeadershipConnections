import { Heading, Text, Img, Button } from "../../components copy";
import Link from "next/link";
import React from "react";

interface Props {
  className?: string;
  passwordLabel?: React.ReactNode;
  passwordValue?: React.ReactNode;
  confirmLabel?: React.ReactNode;
  confirmPasswordValue?: React.ReactNode;
  loginButtonText?: string;
  securedText?: React.ReactNode;
  descriptionText?: React.ReactNode;
  learnMoreLink?: React.ReactNode;
}

export default function SecurePlatformComponent({
  passwordLabel = "Password",
  passwordValue = "**********",
  confirmLabel = "Confirm Password",
  confirmPasswordValue = "**********",
  loginButtonText = "LogIn",
  securedText = "SecuredPlatform",
  descriptionText = "Contrary to popular belief, Lore Ipsum is not simply random text. It has roots in a piece.",
  learnMoreLink = "Learn More",
  ...props
}: Props) {
  return (
    <div {...props} className={`${props.className} flex flex-col justify-center gap-[34px]`}>
      <div className="relative h-[244px] self-stretch">
        <div className="absolute bottom-[18.73px] left-[21.90px] m-auto h-[176px] w-[70%] border-2 border-dashed border-gray-400_03" />
        <Img
          src="img_dashboard.svg"
          width={268}
          height={202}
          alt="Passwordimage"
          className="absolute left-0 right-0 top-0 mx-auto h-[202px] w-[68%] object-contain"
        />
        <div className="absolute bottom-[-0.59px] left-0 m-auto flex flex-col items-start justify-center rounded-[14px] bg-white-a700 px-4 py-3 shadow-lg">
          <Text size="textxs" as="p" className="text-[7px] font-normal !text-black-900">
            {passwordLabel}
          </Text>
          <Text
            size="textmd"
            as="p"
            className="mt-1 rounded bg-gray-200 pl-2 pr-[34px] text-[10px] font-normal tracking-[3.30px] !text-deep_purple-a400 sm:pr-5"
          >
            {passwordValue}
          </Text>
          <Text size="textxs" as="p" className="mt-1 text-[7px] font-normal !text-black-900">
            {confirmLabel}
          </Text>
          <Text
            size="textmd"
            as="p"
            className="mt-1 rounded bg-gray-200 pl-2 pr-[34px] text-[10px] font-normal tracking-[3.30px] !text-deep_purple-a400 sm:pr-5"
          >
            {confirmPasswordValue}
          </Text>
          <Button size="xs" className="mt-2.5 min-w-[40px] rounded px-3 font-bold">
            {loginButtonText}
          </Button>
        </div>
        <Img
          src="img_menu_bar.svg"
          width={226}
          height={32}
          alt="Confirmimage"
          className="absolute right-[1.23px] top-[28%] m-auto h-[32px] w-[58%] object-contain"
        />
      </div>
      <div className="flex flex-col items-center gap-11 self-stretch">
        <div className="flex flex-col items-center gap-4 self-stretch">
          <Heading as="h3" className="text-[30px] font-bold">
            {securedText}
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
