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
  base: "font-[family-name:var(--font-inter)] text-[16px] leading-[1.5] tracking-[0em] font-normal",
  lg: "font-[family-name:var(--font-inter)] text-[18px] leading-[1.5] tracking-[0em] font-medium",
  xl: "font-[family-name:var(--font-inter)] text-[20px] leading-[1.375] tracking-[-0.5px] font-semibold",
  "2xl":
    "font-[family-name:var(--font-inter)] text-[24px] leading-[1.375] tracking-[-0.5px] font-bold",
  "3xl":
    "font-[family-name:var(--font-anton)] text-[30px] leading-[1.25] tracking-[1.5px] font-bold",
  "4xl":
    "font-[family-name:var(--font-anton)] text-[36px] leading-[1.25] tracking-[2px] font-bold",
  "5xl":
    "font-[family-name:var(--font-anton)] text-[48px] leading-[1.1] tracking-[2.5px] font-extrabold",
  "6xl":
    "font-[family-name:var(--font-anton)] text-[60px] leading-[1.1] tracking-[3px] font-extrabold",
  "7xl":
    "font-[family-name:var(--font-anton)] text-[72px] leading-[1] tracking-[3.5px] font-black",
  "8xl":
    "font-[family-name:var(--font-anton)] text-[96px] leading-[1] tracking-[5px] font-black",
} satisfies Record<TypographySize, string>;

export const typographyVariants = cva("text-[var(--fg-primary)]", {
  variants: {
    size: typographySizeVariants,
    textTransform: {
      none: "",
      uppercase: "uppercase",
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
