"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border-[3px] border-[#1a1a1a] text-base font-extrabold tracking-[1px] text-[#1a1a1a] shadow-[6px_6px_0_0_#1a1a1a] transition-[background-color,color,box-shadow] focus-visible:outline-2 focus-visible:outline-transparent focus-visible:outline-offset-[4px] focus-visible:shadow-[0_0_0_2px_#fffdf5,0_0_0_4px_#1a1a1a,6px_6px_0_0_#1a1a1a] hover:shadow-[4px_4px_0_0_#1a1a1a]",
  {
    variants: {
      variant: {
        primary: "bg-[#ff6b6b] hover:bg-[#f05555]",
        secondary: "bg-[#fffdf5] hover:bg-[#f5f0e1]",
        tertiary: "bg-[#a8d8ea] hover:bg-[#92c9d8]",
        highlight: "bg-[#ffe156] hover:bg-[#f5cf2a]",
        dark: "bg-[#1a1a1a] text-[#fffdf5] hover:bg-[#2a2a2a]",
        ghost:
          "bg-transparent shadow-none hover:bg-[#f5f0e1]/90 hover:shadow-none focus-visible:shadow-[0_0_0_2px_#fffdf5,0_0_0_4px_#1a1a1a,6px_6px_0_0_#1a1a1a]",
      },
      size: {
        default: "px-8 py-4",
        small: "px-3 py-1.5 text-xs tracking-[0.5px]",
      },
      expand: {
        true: "z-10 before:pointer-events-auto before:absolute before:inset-0 before:z-10 before:block before:content-['']",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      expand: false,
    },
  },
);

export interface ButtonProps
  extends ComponentPropsWithoutChildren<"button">,
    VariantProps<typeof buttonVariants> {
  children?: ReactNode;
  asChild?: boolean;
  expand?: boolean;
}

export const Button: FC<ButtonProps> = ({
  asChild,
  className,
  variant,
  size,
  children,
  expand = false,
  ...props
}) => {
  const classes = cn(buttonVariants({ variant, size, expand }), className);

  const Component = asChild ? Slot : "button";

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};
