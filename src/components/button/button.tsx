"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import type { IconReference } from "@/lib/icon-ref";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-black font-semibold text-black shadow-[4px_4px_0_0] transition-[background-color] focus-visible:outline-2 focus-visible:outline-transparent focus-visible:outline-offset-[4px] focus-visible:shadow-[0_0_0_2px_#fde047,0_0_0_4px_#000,4px_4px_0_4px_#000]",
  {
    variants: {
      variant: {
        primary: "bg-yellow-300 hover:bg-yellow-400",
        secondary: "bg-white hover:bg-green-300",
        tertiary: "bg-green-300 hover:bg-green-400",
        ghost: "bg-transparent shadow-none hover:bg-yellow-100",
      },
      size: {
        default: "px-5 py-3",
        small: "px-2 py-1 text-xs",
      },
      expand: {
        true: "z-10 before:pointer-events-auto before:absolute before:inset-0 before:z-10 before:block before:content-['']",
        false: "",
      },
      iconOnly: {
        true: "p-3",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      expand: false,
      iconOnly: false,
    },
  },
);

export interface ButtonProps
  extends ComponentPropsWithoutChildren<"button">,
    VariantProps<typeof buttonVariants> {
  children?: ReactNode;
  asChild?: boolean;
  /** Decorative icon; wrapped with `aria-hidden`. Ignored when `asChild` — put the icon inside your child. */
  icon?: IconReference;
  /** @default "start" */
  iconPosition?: "start" | "end";
  /** Visually hide label text while keeping it accessible to screen readers. */
  iconOnly?: boolean;
  /**
   * Expands click target to the nearest positioned ancestor.
   * Requires a parent container with `position: relative`.
   */
  expand?: boolean;
}

export const Button: FC<ButtonProps> = ({
  asChild,
  className,
  variant,
  size,
  children,
  icon: Icon,
  iconPosition = "start",
  iconOnly = false,
  expand = false,
  ...props
}) => {
  const classes = cn(
    buttonVariants({ variant, size, expand, iconOnly }),
    className,
  );

  if (asChild) {
    return (
      <Slot className={classes} {...props}>
        {children}
      </Slot>
    );
  }

  const iconEl = Icon ? (
    <span className="inline-flex shrink-0" aria-hidden>
      <Icon className="size-[1em] shrink-0" />
    </span>
  ) : null;

  return (
    <button className={classes} {...props}>
      {iconEl && iconPosition === "start" ? iconEl : null}
      <span className={iconOnly ? "sr-only" : undefined}>{children}</span>
      {iconEl && iconPosition === "end" ? iconEl : null}
    </button>
  );
};
