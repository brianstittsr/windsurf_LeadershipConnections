import React from "react";

const shapes = {
  circle: "rounded-[50%]",
  round: "rounded-[36px]",
} as const;
const variants = {
  fill: {
    purple_100: "bg-purple-100",
    orange_100: "bg-orange-100",
    deep_purple_A100_01: "bg-deep_purple-a100_01",
    pink_A100: "bg-pink-a100",
    pink_50_02: "bg-pink-50_02",
    gray_100_01: "bg-gray-100_01 text-gray-900_01",
    purple_A200_7f: "bg-purple-a200_7f",
    deep_purple_50: "bg-deep_purple-50 text-deep_purple-a400",
    deep_purple_A200: "bg-deep_purple-a200 text-white-a700",
    pink_50_01: "bg-pink-50_01 text-purple-300_01",
    deep_orange_50: "bg-deep_orange-50 text-orange-a200",
    teal_50: "bg-teal-50 text-blue_gray-500_01",
    deep_purple_A200_04: "bg-deep_purple-a200_04 text-white-a700",
    deep_purple_A200_07: "bg-deep_purple-a200_07",
    yellow_100: "bg-yellow-100 text-lime-800_01",
    deep_purple_50_01: "bg-deep_purple-50_01 text-deep_purple-a400",
    gray_900_01: "bg-gray-900_01 text-white-a700",
    white_A700: "bg-white-a700 text-gray-900_01",
    deep_purple_A400: "bg-deep_purple-a400 text-white-a700",
  },
  outline: {
    black_900: "border-black-900 border border-solid text-gray-900_01",
    blue_gray_100_02: "border-blue_gray-100_02 border border-solid text-gray-900_01",
  },
} as const;
const sizes = {
  sm: "h-[20px] px-1.5",
  xs: "h-[18px] px-3 text-[6px]",
  "4xl": "h-[76px] px-4",
  "6xl": "h-[116px] px-5",
  "2xl": "h-[74px] px-[34px] text-[22px]",
  "7xl": "h-[160px] px-[38px]",
  "5xl": "h-[96px] px-5",
  md: "h-[42px] pl-7 pr-8 text-[20px]",
  xl: "h-[58px] px-2",
  lg: "h-[56px] px-5 text-[18px]",
  "3xl": "h-[74px] px-[34px] text-[18px]",
} as const;

type ButtonProps = Omit<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  "onClick"
> &
  Partial<{
    className: string;
    leftIcon: React.ReactNode;
    rightIcon: React.ReactNode;
    onClick: () => void;
    shape: keyof typeof shapes;
    variant: keyof typeof variants | null;
    size: keyof typeof sizes;
    color: string;
  }>;
const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  children,
  className = "",
  leftIcon,
  rightIcon,
  shape,
  variant = "fill",
  size = "3xl",
  color = "deep_purple_A400",
  ...restProps
}) => {
  return (
    <button
      className={`${className} flex flex-row items-center justify-center text-center cursor-pointer whitespace-nowrap ${shape && shapes[shape]} ${size && sizes[size]} ${variant && variants[variant]?.[color as keyof (typeof variants)[typeof variant]]}`}
      {...restProps}
    >
      {!!leftIcon && leftIcon}
      {children}
      {!!rightIcon && rightIcon}
    </button>
  );
};

export { Button };
