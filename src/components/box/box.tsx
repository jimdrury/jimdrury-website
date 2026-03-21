import type { FC, ReactNode } from "react";
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
  none: "m-0",
  xs: "m-2",
  sm: "m-4",
  md: "m-6",
  lg: "m-8",
  xl: "m-12",
};

const backgroundColourClasses: Record<BoxBackgroundColour, string> = {
  none: "",
  white: "bg-white",
  light_grey: "bg-zinc-100",
  dark: "bg-zinc-800",
  black: "bg-black",
  yellow: "bg-yellow-300",
  blue: "bg-blue-200",
};

const textColourClasses: Record<BoxTextColour, string> = {
  default: "",
  black: "text-black",
  white: "text-white",
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
        "shadow-[6px_6px_0_0_#000]",
        paddingClasses[padding],
        marginClasses[margin],
        backgroundColourClasses[backgroundColour],
        textColourClasses[textColour],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
