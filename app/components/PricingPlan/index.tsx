import { Button } from "../Button";
import { Text } from "../Text";
import { Heading } from "../Heading";
import React from "react";

interface Props {
  className?: string;
  titleText?: React.ReactNode;
  saveButtonText?: string;
  priceText?: React.ReactNode;
  billedButtonText?: string;
  descriptionText?: React.ReactNode;
  getStartedButtonText?: string;
}

export default function PricingPlan({
  titleText = "Basic",
  saveButtonText = "Save 30%",
  priceText,
  billedButtonText = "Billed as $96 per year",
  descriptionText,
  getStartedButtonText = "Get Started",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center justify-center w-[50%] md:w-full gap-[34px] px-[34px] py-12 md:py-5 sm:p-4 bg-gray-50_01 rounded-[30px]`}
    >
      <div className="flex items-center justify-between gap-5 self-stretch">
        <Heading size="heading9xl" as="h1" className="text-[40px] font-extrabold">
          {titleText}
        </Heading>
        <Button color="white_A700" size="lg" className="min-w-[126px] rounded-[28px] px-5 font-bold !text-gray-600">
          {saveButtonText}
        </Button>
      </div>
      <div className="flex flex-col items-center gap-[42px] self-stretch">
        <div className="flex flex-col gap-2.5 self-stretch">
          <div className="h-px bg-blue_gray-100_02" />
          <div className="flex flex-col items-center">
            <Heading size="heading9xl" as="h1" className="text-[40px] font-extrabold">
              <span>$7.99</span>
              <span className="text-[20px]">&nbsp;/ month</span>
            </Heading>
            <Button color="yellow_100" size="md" className="mx-[60px] mt-3.5 self-stretch rounded-[20px] font-semibold">
              {billedButtonText}
            </Button>
            <div className="mt-[22px] h-px w-full self-stretch bg-blue_gray-100_02" />
          </div>
        </div>
        <Text as="p" className="text-center text-[20px] font-normal leading-[244.4%]">
          <span className="text-gray-600">
            <>
              Unlimited members
              <br />
              <br />
            </>
          </span>
          <span className="font-bold text-gray-900_01">Unlimited</span>
          <span className="text-gray-600">
            <>
              &nbsp;feedback
              <br />
              <br />
              Weekly team Feedback Friday
              <br />
              <br />
              Custom Kudos&nbsp;
            </>
          </span>
          <span className="font-bold text-gray-900_01">
            <>
              +9 illustration
              <br />
            </>
          </span>
          <span className="text-gray-600">
            <>
              <br />
              Team feedback history
            </>
          </span>
        </Text>
      </div>
      <Button
        color="blue_gray_100_02"
        variant="outline"
        shape="round"
        className="min-w-[200px] rounded-[36px] !border px-[33px] font-bold sm:px-5"
      >
        {getStartedButtonText}
      </Button>
    </div>
  );
}
