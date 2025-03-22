import { Button, Heading, Img } from "../../components copy";
import React from "react";

interface Props {
  className?: string;
  userImage?: string;
  addressText?: React.ReactNode;
  phoneNumber?: string;
}

export default function UserProfile5({
  userImage = "img_linkedin.svg",
  addressText,
  phoneNumber = "(415) 870 – 3204",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col justify-center w-[32%] md:w-full gap-2 px-14 py-16 lg:py-8 md:p-5 sm:p-4 border-gray-300_02 border border-solid bg-white-a700 cursor-pointer rounded-[30px] hover:shadow-4xl`}
    >
      <div className="flex flex-col items-center gap-4 self-stretch">
        <div className="flex w-[26%] flex-col items-center justify-center rounded-[42px] bg-pink-50_02 p-[22px] sm:p-5">
          <Img src={userImage} width={26} height={38} alt="Userimage" className="h-[38px]" />
        </div>
        <Heading
          size="heading10xl"
          as="h1"
          className="text-center text-[50px] font-extrabold leading-[110%] !text-black-900"
        >
          <span className="text-[30px] text-black-900">
            <>
              Paris
              <br />
            </>
          </span>
          <span className="text-[20px] font-normal text-gray-600">
            <>
              19 Maypole Crescent
              <br />
              Ilford,L62UJ
            </>
          </span>
        </Heading>
      </div>
      <Button
        color="pink_50_01"
        size="2xl"
        shape="round"
        className="mx-3.5 mb-3.5 self-stretch rounded-[36px] px-[34px] font-bold sm:px-5"
      >
        {phoneNumber}
      </Button>
    </div>
  );
}
