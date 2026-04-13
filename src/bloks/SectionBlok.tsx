import "server-only";
import type { FC } from "react";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";
import { BlokRenderer } from "@/storyblok/renderer";

type MaxWidth =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "5xl"
  | "7xl"
  | "full";
type Background = "none" | "white" | "light_grey" | "dark" | "black" | "yellow";
type SectionPadding = "none" | "sm" | "md" | "lg" | "xl";

type SectionBlokData = SbBlokData & {
  max_width?: MaxWidth;
  background?: Background;
  padding_top?: SectionPadding;
  padding_bottom?: SectionPadding;
  body?: SbBlokData[];
};

type SectionBlokProps = {
  blok: SectionBlokData;
};

const maxWidthValues: Record<MaxWidth, string> = {
  sm: "24rem",
  md: "28rem",
  lg: "32rem",
  xl: "36rem",
  "2xl": "42rem",
  "3xl": "48rem",
  "5xl": "64rem",
  "7xl": "80rem",
  full: "none",
};

const backgroundStyles: Record<
  Background,
  { backgroundColor?: string; color?: string }
> = {
  none: {},
  white: { backgroundColor: "#ffffff", color: "#000000" },
  light_grey: { backgroundColor: "#f4f4f5", color: "#000000" },
  dark: { backgroundColor: "#27272a", color: "#ffffff" },
  black: { backgroundColor: "#000000", color: "var(--fg-inverse)" },
  yellow: {
    backgroundColor: "var(--bg-accent-yellow)",
    color: "var(--fg-primary)",
  },
};

const paddingTopValues: Record<SectionPadding, string> = {
  none: "0",
  sm: "1rem",
  md: "2rem",
  lg: "3rem",
  xl: "4rem",
};

const paddingBottomValues: Record<SectionPadding, string> = {
  none: "0",
  sm: "1rem",
  md: "2rem",
  lg: "3rem",
  xl: "4rem",
};

export const SectionBlok: FC<SectionBlokProps> = ({ blok }) => {
  const maxWidth = blok.max_width ?? "3xl";
  const background = blok.background ?? "none";
  const paddingTop = blok.padding_top ?? "none";
  const paddingBottom = blok.padding_bottom ?? "none";

  return (
    <section
      {...storyblokEditable(blok)}
      className="w-full"
      style={{
        ...backgroundStyles[background],
        paddingTop: paddingTopValues[paddingTop],
        paddingBottom: paddingBottomValues[paddingBottom],
      }}
    >
      <div
        className="@container w-full space-y-4"
        style={{ maxWidth: maxWidthValues[maxWidth] }}
      >
        {blok.body?.map((nestedBlok) => (
          <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
        ))}
      </div>
    </section>
  );
};
