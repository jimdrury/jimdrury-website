import "server-only";
import type { FC } from "react";
import { Divider } from "@/components/divider";
import { cn } from "@/lib/utils";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";

type DividerSpacing = "none" | "sm" | "md" | "lg";

type DividerBlokData = SbBlokData & {
  label?: string;
  spacing?: DividerSpacing;
};

type DividerBlokProps = {
  blok: DividerBlokData;
};

const spacingClasses: Record<DividerSpacing, string> = {
  none: "",
  sm: "my-2",
  md: "my-4",
  lg: "my-8",
};

export const DividerBlok: FC<DividerBlokProps> = ({ blok }) => {
  const spacing = blok.spacing ?? "md";

  return (
    <Divider
      {...storyblokEditable(blok)}
      label={blok.label}
      className={cn(spacingClasses[spacing])}
    />
  );
};
