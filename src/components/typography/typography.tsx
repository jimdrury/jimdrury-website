"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import type { TypographySize } from "./typography-size";

// font-[family-name:var(--…)] (not font-[var(--…)]) — Tailwind v4 emits font-family, not font-weight.
const typographySizeVariants = {
  xs: "font-[family-name:var(--font-inter)] text-[12px] leading-[1.5] tracking-[0em] font-normal",
  sm: "font-[family-name:var(--font-inter)] text-[14px] leading-[1.5] tracking-[0em] font-normal",
  base: "font-[family-name:var(--font-inter)] text-[17px] leading-[1.2] tracking-[0em] font-normal",
  lg: "font-[family-name:var(--font-inter)] text-[18px] leading-[1] tracking-[0em] font-medium",
  xl: "font-[family-name:var(--font-geist-sans)] text-[20px] leading-[1.2] tracking-[-0.02em] font-medium",
  "2xl":
    "font-[family-name:var(--font-geist-sans)] text-[24px] leading-[1.1] tracking-[-0.02em] font-medium",
  "3xl":
    "font-[family-name:var(--font-geist-sans)] text-[30px] leading-[0.9] tracking-[-0.03em] font-medium",
  "4xl":
    "font-[family-name:var(--font-geist-sans)] text-[length:var(--text-4xl)] leading-[0.95] tracking-[-0.03em] font-medium min-w-0 max-w-full [overflow-wrap:anywhere]",
  "5xl":
    "font-[family-name:var(--font-geist-sans)] text-[length:var(--text-5xl)] leading-[0.92] tracking-[-0.03em] font-medium min-w-0 max-w-full [overflow-wrap:anywhere]",
  "6xl":
    "font-[family-name:var(--font-geist-sans)] text-[length:var(--text-6xl)] leading-[0.9] tracking-[-0.04em] font-medium min-w-0 max-w-full [overflow-wrap:anywhere]",
  "7xl":
    "font-[family-name:var(--font-geist-sans)] text-[length:var(--text-7xl)] leading-[0.88] tracking-[-0.04em] font-medium min-w-0 max-w-full [overflow-wrap:anywhere]",
  "8xl":
    "font-[family-name:var(--font-geist-sans)] text-[length:var(--text-8xl)] leading-[0.85] tracking-[-0.05em] font-medium min-w-0 max-w-full [overflow-wrap:anywhere]",
} satisfies Record<TypographySize, string>;

export const typographyVariants = cva("text-[var(--fg-primary)]", {
  variants: {
    size: typographySizeVariants,
    textTransform: {
      none: "",
      uppercase: "capitalize",
      lowercase: "lowercase",
      capitalize: "capitalize",
    },
  },
  defaultVariants: {
    size: "base",
    textTransform: "none",
  },
});

/** Use with `asChild` + `<h1>`–`<h4>` when mirroring semantic heading scale (size picks weight). */
export const TYPOGRAPHY_HEADING_PRESETS: Record<
  "h1" | "h2" | "h3" | "h4",
  { size: TypographySize }
> = {
  h1: { size: "3xl" },
  h2: { size: "2xl" },
  h3: { size: "xl" },
  h4: { size: "lg" },
};

export interface TypographyProps
  extends Omit<ComponentPropsWithoutChildren<"p">, "className">,
    VariantProps<typeof typographyVariants> {
  children?: ReactNode;
  /**
   * Merge typography styles onto the single child element (Radix `Slot`).
   * Use for semantic headings/links: `<Typography asChild size="lg"><h2>…</h2></Typography>`.
   */
  asChild?: boolean;
}

export const Typography: FC<TypographyProps> = ({
  asChild = false,
  size,
  textTransform = "none",
  children,
  ...props
}) => {
  const resolvedSize = size ?? "base";

  const classes = typographyVariants({ size: resolvedSize, textTransform });

  if (asChild) {
    return (
      <Slot className={classes} {...props}>
        {children}
      </Slot>
    );
  }

  return (
    <p className={classes} {...props}>
      {children}
    </p>
  );
};
