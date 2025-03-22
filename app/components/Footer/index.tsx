import { Img } from "../Img";
import { Text } from "../Text";
import { Heading } from "../Heading";
import Link from "next/link";
import React from "react";

interface Props {
  className?: string;
}

export default function Footer({ ...props }: Props) {
  return (
    <footer {...props} className={`${props.className} flex`}>
      <div className="w-full">
        <div className="h-px bg-gray-300_02" />
        <div className="mt-[150px] flex items-start justify-between gap-5 md:flex-col">
          <div className="flex w-[26%] flex-col gap-9 md:w-full">
            <div className="flex flex-col items-start gap-[26px]">
              <Img
                src="img_footer_logo.png"
                width={172}
                height={40}
                alt="Footerlogo"
                className="h-[40px] w-[172px] object-contain"
              />
              <Text as="p" className="text-[22px] font-normal leading-[157.4%]">
                <>
                  It is a long established fact that from
                  <br />
                  will be distracted by the readable <br />
                  from when looking.
                </>
              </Text>
            </div>
            <div className="flex w-[62%] flex-col gap-[18px] md:w-full">
              <div className="flex items-start gap-4">
                <Img src="img_lock_deep_purple_a400.svg" width={22} height={22} alt="Lock" className="mt-2 h-[22px]" />
                <div className="flex flex-1 flex-col items-start self-center">
                  <Text as="p" className="text-[22px] font-normal">
                    saasup@gmail.com
                  </Text>
                  <Text as="p" className="text-[22px] font-normal">
                    mail@saasup.com
                  </Text>
                </div>
              </div>
              <div className="mr-5 flex items-start gap-4 md:mr-0">
                <Img src="img_phone_call.svg" width={22} height={22} alt="Phonecall" className="mt-2 h-[22px]" />
                <div className="flex flex-1 flex-col items-center self-center">
                  <Text as="p" className="text-[22px] font-normal">
                    +987 6541 3654
                  </Text>
                  <Text as="p" className="text-[22px] font-normal">
                    +001 6547 6589
                  </Text>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-[12%] flex-col md:w-full">
            <div className="relative z-[1]">
              <div className="mt-[72px] h-px bg-gray-300_02" />
            </div>
            <div className="relative mt-[-72px] flex w-[88%] flex-col items-start gap-[38px] md:w-full">
              <Heading as="h3" className="text-[30px] font-bold capitalize md:text-[28px] sm:text-[26px]">
                Pages
              </Heading>
              <ul className="flex flex-col items-start gap-11 self-stretch">
                <li>
                  <Link href="Home" target="_blank" rel="noreferrer">
                    <Text as="p" className="text-[22px] font-normal capitalize">
                      Home
                    </Text>
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <Text as="p" className="text-[22px] font-normal capitalize">
                      About Us
                    </Text>
                  </Link>
                </li>
                <li>
                  <Link href="Integrations" target="_blank" rel="noreferrer">
                    <Text as="p" className="text-[22px] font-normal capitalize">
                      Integrations
                    </Text>
                  </Link>
                </li>
                <li>
                  <Link href="Pricing" target="_blank" rel="noreferrer">
                    <Text as="p" className="text-[22px] font-normal capitalize">
                      Pricing
                    </Text>
                  </Link>
                </li>
                <li>
                  <Link href="Features" target="_blank" rel="noreferrer">
                    <Text as="p" className="text-[22px] font-normal capitalize">
                      Features
                    </Text>
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <Text as="p" className="text-[22px] font-normal capitalize">
                      Contact Us
                    </Text>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-[12%] self-center md:w-full">
            <div className="relative z-[2]">
              <div className="mt-[70px] h-px bg-gray-300_02" />
            </div>
            <div className="relative mt-[-72px] flex flex-col items-start gap-[38px]">
              <Heading as="h3" className="text-[30px] font-bold capitalize md:text-[28px] sm:text-[26px]">
                Utility Pages
              </Heading>
              <ul className="flex flex-col items-start gap-11">
                <li>
                  <Link href="#">
                    <Text as="p" className="text-[22px] font-normal capitalize">
                      Password Protected
                    </Text>
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <Text as="p" className="text-[22px] font-normal capitalize">
                      404 Not Found
                    </Text>
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <Text as="p" className="text-[22px] font-normal capitalize">
                      Style Guide
                    </Text>
                  </Link>
                </li>
                <li>
                  <Link href="Licenses" target="_blank" rel="noreferrer">
                    <Text as="p" className="text-[22px] font-normal capitalize">
                      Licenses
                    </Text>
                  </Link>
                </li>
                <li>
                  <Link href="Changelog" target="_blank" rel="noreferrer">
                    <Text as="p" className="text-[22px] font-normal capitalize">
                      Changelog
                    </Text>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex w-[34%] justify-center rounded-[50px] bg-gray-50_01 px-9 py-16 md:w-full md:py-5 sm:p-5">
            <div className="flex w-full flex-col items-start">
              <Heading size="heading2xl" as="h6" className="text-[18px] font-bold capitalize !text-deep_purple-a400">
                Download
              </Heading>
              <Heading
                as="h3"
                className="mt-3.5 text-[30px] font-extrabold leading-[123%] md:text-[28px] sm:text-[26px]"
              >
                <>
                  Its suitable to all
                  <br />
                  decvices and screens
                </>
              </Heading>
              <Text as="p" className="mt-3.5 w-[94%] text-[22px] font-normal leading-[157.4%] md:w-full">
                It is a long established fact that a reader will be distracted layout.
              </Text>
              <div className="mt-8 flex gap-4 self-stretch sm:flex-col">
                <Link href="#">
                  <Img
                    src="img_button.png"
                    width={200}
                    height={74}
                    alt="Button"
                    className="h-[74px] w-[200px] rounded-[36px] object-contain"
                  />
                </Link>
                <Link href="#">
                  <Img
                    src="img_button_74x200.png"
                    width={200}
                    height={74}
                    alt="Button"
                    className="h-[74px] w-[200px] rounded-[36px] object-contain"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-[50px] h-px bg-gray-300_02" />
        <div className="mt-[34px] flex items-center justify-between gap-5 md:flex-col">
          <Text as="p" className="text-[22px] font-normal">
            Copyright © Saasup | Designed by Victorflow - Powered by Webflow
          </Text>
          <div className="flex w-[10%] justify-between gap-5 md:w-full">
            <Img src="img_facebook_gray_900_01.svg" width={12} height={22} alt="Facebook" className="h-[22px]" />
            <Img src="img_facebook_gray_900_01.svg" width={18} height={22} alt="Facebook" className="h-[22px]" />
            <Img src="img_facebook_gray_900_01.svg" width={16} height={22} alt="Facebook" className="h-[22px]" />
            <Img src="img_facebook_gray_900_01.svg" width={16} height={22} alt="Facebook" className="h-[22px]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
