import type { FC, ReactNode } from "react";
import { RuleMarks } from "@/components/rule-box";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export type BoxSpacing = "none" | "xs" | "sm" | "md" | "lg" | "xl";
export type BoxBackgroundColour =
  | "none"
  | "white"
  | "light_grey"
  | "dark"
  | "black"
  | "yellow"
  | "blue";
export type BoxTextColour = "default" | "black" | "white";

export interface BoxProps extends ComponentPropsWithoutChildren<"div"> {
  children?: ReactNode;
  padding?: BoxSpacing;
  margin?: BoxSpacing;
  backgroundColour?: BoxBackgroundColour;
  textColour?: BoxTextColour;
}

const paddingClasses: Record<BoxSpacing, string> = {
  none: "p-0",
  xs: "p-2",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
  xl: "p-12",
};

const marginClasses: Record<BoxSpacing, string> = {
  none: "m-0 mb-6",
  xs: "m-2",
  sm: "m-4",
  md: "m-6",
  lg: "m-8",
  xl: "m-12",
};

const backgroundColourClasses: Record<BoxBackgroundColour, string> = {
  none: "",
  white: "bg-[var(--bg-primary)]",
  light_grey: "bg-[var(--bg-secondary)]",
  dark: "bg-[var(--bg-dark)]",
  black: "bg-black",
  yellow: "bg-[var(--bg-accent-yellow)]",
  blue: "bg-[var(--bg-accent-blue)]",
};

const textColourClasses: Record<BoxTextColour, string> = {
  default: "",
  black: "text-[var(--fg-primary)]",
  white: "text-[var(--fg-inverse)]",
};

export const Box: FC<BoxProps> = ({
  children,
  className,
  padding = "md",
  margin = "none",
  backgroundColour = "none",
  textColour = "default",
  ...props
}) => {
  return (
    <div
      className={cn(
        "rule-box relative overflow-visible rounded-none",
        paddingClasses[padding],
        marginClasses[margin],
        backgroundColourClasses[backgroundColour],
        textColourClasses[textColour],
        className,
      )}
      {...props}
    >
      <RuleMarks />
      {children}
    </div>
  );
};
