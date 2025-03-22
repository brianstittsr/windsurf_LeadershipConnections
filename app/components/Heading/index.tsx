import React from "react";

const sizes = {
  textxl: "text-[16px] font-medium lg:text-[13px]",
  text2xl: "text-[18px] font-medium lg:text-[15px]",
  headingxs: "text-[6px] font-bold",
  headings: "text-[8px] font-bold",
  headingmd: "text-[9px] font-bold",
  headinglg: "text-[12px] font-bold",
  headingxl: "text-[15px] font-extrabold",
  heading2xl: "text-[18px] font-bold lg:text-[15px]",
  heading3xl: "text-[20px] font-bold lg:text-[17px]",
  heading4xl: "text-[22px] font-bold lg:text-[18px]",
  heading5xl: "text-[24px] font-semibold lg:text-[20px] md:text-[22px]",
  heading6xl: "text-[25px] font-bold lg:text-[21px] md:text-[23px] sm:text-[21px]",
  heading7xl: "text-[30px] font-bold lg:text-[25px] md:text-[28px] sm:text-[26px]",
  heading8xl: "text-[35px] font-bold lg:text-[29px] md:text-[33px] sm:text-[31px]",
  heading9xl: "text-[40px] font-extrabold lg:text-[34px] md:text-[38px] sm:text-[36px]",
  heading10xl: "text-[50px] font-extrabold lg:text-[42px] md:text-[46px] sm:text-[40px]",
  heading11xl: "text-[75px] font-extrabold lg:text-[75px] md:text-[48px]",
  heading12xl: "text-[100px] font-extrabold lg:text-[100px] md:text-[48px]",
  heading13xl: "text-[176px] font-extrabold lg:text-[176px] md:text-[48px]",
  heading14xl: "text-[300px] font-extrabold lg:text-[300px] md:text-[48px]",
};

export type HeadingProps = Partial<{
  className: string;
  as: any;
  size: keyof typeof sizes;
}> &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

const Heading: React.FC<React.PropsWithChildren<HeadingProps>> = ({
  children,
  className = "",
  size = "heading7xl",
  as,
  ...restProps
}) => {
  const Component = as || "h6";

  return (
    <Component
      className={`text-gray-900_01 font-nunito ${className} ${sizes[size] as keyof typeof sizes}`}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export { Heading };
