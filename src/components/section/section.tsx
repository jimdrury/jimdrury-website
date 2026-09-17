import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export type SectionMaxWidth =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "5xl"
  | "7xl"
  | "full";

export type SectionBackground =
  | "none"
  | "white"
  | "light_grey"
  | "dark"
  | "black"
  | "yellow";

export type SectionPadding = "none" | "sm" | "md" | "lg" | "xl";

export interface SectionProps extends ComponentPropsWithoutChildren<"section"> {
  children?: ReactNode;
  maxWidth?: SectionMaxWidth;
  background?: SectionBackground;
  paddingTop?: SectionPadding;
  paddingBottom?: SectionPadding;
}

const maxWidthClasses: Record<SectionMaxWidth, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "5xl": "max-w-5xl",
  "7xl": "max-w-7xl",
  full: "max-w-full",
};

const backgroundClasses: Record<SectionBackground, string> = {
  none: "",
  white: "bg-white text-black",
  light_grey: "bg-[#f4f4f5] text-black",
  dark: "bg-[#27272a] text-white",
  black: "bg-black text-[var(--fg-inverse)]",
  yellow: "bg-[var(--bg-accent-yellow)] text-[var(--fg-primary)]",
};

const paddingTopClasses: Record<SectionPadding, string> = {
  none: "",
  sm: "pt-4",
  md: "pt-8",
  lg: "pt-12",
  xl: "pt-16",
};

const paddingBottomClasses: Record<SectionPadding, string> = {
  none: "",
  sm: "pb-4",
  md: "pb-8",
  lg: "pb-12",
  xl: "pb-16",
};

const resolveOption = <T extends string>(
  value: T | undefined,
  options: Record<T, string>,
  fallback: T,
): T => {
  if (value && value in options) {
    return value;
  }

  return fallback;
};

export const Section: FC<SectionProps> = ({
  children,
  className,
  maxWidth,
  background,
  paddingTop,
  paddingBottom,
  ...props
}) => {
  const resolvedMaxWidth = resolveOption(maxWidth, maxWidthClasses, "3xl");
  const resolvedBackground = resolveOption(
    background,
    backgroundClasses,
    "none",
  );
  const resolvedPaddingTop = resolveOption(
    paddingTop,
    paddingTopClasses,
    "none",
  );
  const resolvedPaddingBottom = resolveOption(
    paddingBottom,
    paddingBottomClasses,
    "none",
  );

  return (
    <section
      className={cn(
        "w-full",
        backgroundClasses[resolvedBackground],
        paddingTopClasses[resolvedPaddingTop],
        paddingBottomClasses[resolvedPaddingBottom],
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "@container mx-auto w-full space-y-4 px-5 lg:px-12",
          maxWidthClasses[resolvedMaxWidth],
        )}
      >
        {children}
      </div>
    </section>
  );
};
