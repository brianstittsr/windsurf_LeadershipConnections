import React from "react";

const sizes = {
  textxs: "text-[7px] font-normal",
  texts: "text-[8px] font-normal",
  textmd: "text-[10px] font-normal",
  textlg: "text-[11px] font-normal",
  text3xl: "text-[20px] font-normal lg:text-[17px]",
  text4xl: "text-[22px] font-normal lg:text-[18px]",
  text5xl: "text-[25px] font-normal lg:text-[21px] md:text-[23px] sm:text-[21px]",
};

export type TextProps = Partial<{
  className: string;
  as: any;
  size: keyof typeof sizes;
}> &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

const Text: React.FC<React.PropsWithChildren<TextProps>> = ({
  children,
  className = "",
  as,
  size = "text4xl",
  ...restProps
}) => {
  const Component = as || "p";

  return (
    <Component
      className={`text-gray-600 font-nunito ${className} ${sizes[size as keyof typeof sizes]} `}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export { Text };
