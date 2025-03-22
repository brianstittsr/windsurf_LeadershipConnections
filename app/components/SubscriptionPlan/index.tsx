import { Button, Text, Heading } from "../../components copy";
import React from "react";

interface Props {
  className?: string;
  titleText?: React.ReactNode;
  saveButtonLabel?: string;
  priceText?: React.ReactNode;
  billedAsButtonLabel?: string;
  descriptionText?: React.ReactNode;
  getStartedButtonLabel?: string;
}

export default function SubscriptionPlan({
  titleText = "Basic",
  saveButtonLabel = "Save 30%",
  priceText,
  billedAsButtonLabel = "Billed as $96 per year",
  descriptionText,
  getStartedButtonLabel = "Get Started",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center justify-center w-[32%] md:w-full gap-[34px] px-[34px] py-12 md:py-5 sm:p-4 rounded-[30px]`}
    >
      <div className="flex items-center justify-between gap-5 self-stretch">
        <Heading size="heading9xl" as="h1" className="text-[40px] font-extrabold">
          {titleText}
        </Heading>
        <Button color="white_A700" size="lg" className="min-w-[126px] rounded-[28px] px-5 font-bold !text-gray-600">
          {saveButtonLabel}
        </Button>
      </div>
      <div className="flex flex-col items-center gap-[42px] self-stretch">
        <div className="flex flex-col items-center self-stretch">
          <div className="h-px w-full self-stretch bg-blue_gray-100_02" />
          <Heading size="heading9xl" as="h1" className="mt-2.5 text-[40px] font-extrabold">
            <span>$7.99</span>
            <span className="text-[20px]">&nbsp;/ month</span>
          </Heading>
          <Button color="yellow_100" size="md" className="mx-[60px] mt-3.5 self-stretch rounded-[20px] font-semibold">
            {billedAsButtonLabel}
          </Button>
          <div className="mt-[22px] h-px w-full self-stretch bg-blue_gray-100_02" />
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
        {getStartedButtonLabel}
      </Button>
    </div>
  );
}
