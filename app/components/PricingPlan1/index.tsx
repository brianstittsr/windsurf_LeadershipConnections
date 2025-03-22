import { Button } from "../Button";
import { Img } from "../Img";
import { Heading } from "../Heading";
import React from "react";

interface Props {
  className?: string;
  titleText?: React.ReactNode;
  priceText?: React.ReactNode;
  closeimage1?: string;
  closeimage2?: string;
  closeimage3?: string;
  checkmarkimage2?: string;
  closeimage4?: string;
  closeimage5?: string;
  closeimage6?: string;
  buttonText?: string;
}

export default function PricingPlan1({
  titleText = "Basic",
  priceText = "$7.99 / month",
  closeimage1 = "img_close.svg",
  closeimage2 = "img_close.svg",
  closeimage3 = "img_close.svg",
  checkmarkimage2 = "img_checkmark.svg",
  closeimage4 = "img_close.svg",
  closeimage5 = "img_close.svg",
  closeimage6 = "img_close.svg",
  buttonText = "Get Started",
  ...props
}: Props) {
  return (
    <div {...props} className={`${props.className} flex flex-col items-center w-[32%] md:w-full`}>
      <div className="mx-9 flex flex-col items-center self-stretch">
        <Heading size="heading9xl" as="h1" className="relative z-[1] text-[40px] font-extrabold">
          {titleText}
        </Heading>
        <Heading size="heading3xl" as="h5" className="relative mt-[-4px] text-[20px] font-semibold">
          {priceText}
        </Heading>
      </div>
      <Img src="img_checkmark.svg" width={28} height={28} alt="Checkmarkimage" className="mt-[178px] h-[28px]" />
      <Img src={closeimage1} width={28} height={28} alt="Closeimage1" className="mt-[66px] h-[28px]" />
      <Img src={closeimage2} width={28} height={28} alt="Closeimage2" className="mt-[66px] h-[28px]" />
      <Img src={closeimage3} width={28} height={28} alt="Closeimage3" className="mt-[166px] h-[28px]" />
      <Img src={checkmarkimage2} width={28} height={28} alt="Checkmarkimage2" className="mt-16 h-[28px]" />
      <Img src={closeimage4} width={28} height={28} alt="Closeimage4" className="mt-[62px] h-[28px]" />
      <Img src={closeimage5} width={28} height={28} alt="Closeimage5" className="mt-[170px] h-[28px]" />
      <Img src="img_checkmark.svg" width={28} height={28} alt="Checkmarkimage3" className="mt-[66px] h-[28px]" />
      <Img src={closeimage6} width={28} height={28} alt="Closeimage6" className="mt-[66px] h-[28px]" />
      <Button
        color="blue_gray_100_02"
        variant="outline"
        shape="round"
        className="mt-[88px] self-stretch rounded-[36px] !border px-[33px] font-bold sm:px-5"
      >
        {buttonText}
      </Button>
    </div>
  );
}
