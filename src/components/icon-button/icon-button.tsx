"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { FC, ReactNode } from "react";
import { FaPlus } from "react-icons/fa";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import type { IconReference } from "@/lib/icon-ref";
import { cn } from "@/lib/utils";

export const iconButtonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center border-2 border-black font-bold transition-[background-color] duration-150 focus-visible:focus-ring",
  {
    variants: {
      variant: {
        solid:
          "bg-yellow-300 shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none",
        outlined:
          "bg-white shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none",
        ghost:
          "border-transparent bg-transparent shadow-none hover:bg-zinc-100",
      },
      size: {
        sm: "size-8",
        md: "size-10",
        lg: "size-12",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  },
);

export interface IconButtonProps
  extends ComponentPropsWithoutChildren<"button">,
    VariantProps<typeof iconButtonVariants> {
  children?: ReactNode;
  asChild?: boolean;
  label?: string;
  defaultIcon?: IconReference;
}

export const IconButton: FC<IconButtonProps> = ({
  asChild,
  className,
  size,
  variant,
  children,
  label,
  defaultIcon: DefaultIcon,
  ...props
}) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      aria-label={label}
      className={cn(iconButtonVariants({ size, variant }), className)}
      {...props}
    >
      {children ??
        (DefaultIcon ? (
          <DefaultIcon aria-hidden className="size-4" />
        ) : (
          <FaPlus aria-hidden className="size-4" />
        ))}
    </Comp>
  );
};
