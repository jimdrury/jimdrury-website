"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-none border border-[var(--color-border)] font-[family-name:var(--font-geist-sans)] text-sm font-medium tracking-[0.01em] text-[var(--fg-primary)] transition-colors focus-visible:focus-ring",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-[var(--bg-accent-pink)] text-[var(--fg-on-accent)] hover:bg-[#d45bb6]",
        secondary: "bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)]",
        tertiary:
          "border-transparent bg-[var(--bg-accent-blue)] text-[var(--fg-on-accent)] hover:opacity-90",
        highlight:
          "border-transparent bg-[var(--bg-accent-yellow)] text-[var(--fg-on-accent)] hover:bg-[#d45bb6]",
        dark: "border-transparent bg-[var(--fg-primary)] text-[var(--fg-inverse)] hover:bg-[#2a2a2a]",
        ghost:
          "border-transparent bg-transparent hover:bg-[var(--bg-secondary)]",
      },
      size: {
        default: "px-5 py-2.5",
        small: "px-3 py-1.5 text-xs",
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
