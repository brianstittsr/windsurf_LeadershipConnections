"use client";
import React from "react";

const shapes = {
  round: "rounded-[20px]",
} as const;

const variants = {
  fill: {
    white_A700_66: "bg-white-a700_66 text-blue_gray-300_02",
    white_A700_33: "bg-white-a700_33 text-white-a700",
    white_A700: "bg-white-a700 text-gray-600",
  },
} as const;

const sizes = {
  xs: "h-[30px] px-2.5 text-[11px]",
  sm: "h-[74px] px-[26px] text-[18px]",
  md: "h-[80px] px-[30px] text-[20px]",
} as const;

type InputProps = Omit<React.ComponentPropsWithoutRef<"input">, "prefix" | "size"> &
  Partial<{
    label: string;
    prefix: React.ReactNode;
    suffix: React.ReactNode;
    shape: keyof typeof shapes;
    variant: keyof typeof variants | null;
    size: keyof typeof sizes;
    color: string;
  }>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      name = "",
      placeholder = "",
      type = "text",
      label = "",
      prefix,
      suffix,
      onChange,
      shape,
      variant = "fill",
      size = "md",
      color = "white_A700",
      ...restProps
    },
    ref,
  ) => {
    return (
      <label
        className={`${className} flex items-center justify-center cursor-text  ${shape && shapes[shape]} ${variant && (variants[variant]?.[color as keyof (typeof variants)[typeof variant]] || variants[variant])} ${size && sizes[size]}`}
      >
        {!!label && label}
        {!!prefix && prefix}
        <input ref={ref} type={type} name={name} placeholder={placeholder} onChange={onChange} {...restProps} />
        {!!suffix && suffix}
      </label>
    );
  },
);

export { Input };
