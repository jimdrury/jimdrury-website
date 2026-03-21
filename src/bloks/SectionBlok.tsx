import "server-only";
import {
  type SbBlokData,
  StoryblokServerComponent,
  storyblokEditable,
} from "@storyblok/react/rsc";
import type { FC } from "react";
import { cn } from "@/lib/utils";

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

type SectionBlokData = SbBlokData & {
  max_width?: MaxWidth;
  background?: Background;
  body?: SbBlokData[];
};

type SectionBlokProps = {
  blok: SectionBlokData;
};

const maxWidthClasses: Record<MaxWidth, string> = {
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

const backgroundClasses: Record<Background, string> = {
  none: "",
  white: "bg-white text-black",
  light_grey: "bg-zinc-100 text-black",
  dark: "bg-zinc-800 text-white",
  black: "bg-black text-white",
  yellow: "bg-yellow-300 text-black",
};

export const SectionBlok: FC<SectionBlokProps> = ({ blok }) => {
  const maxWidth = blok.max_width ?? "3xl";
  const background = blok.background ?? "none";

  return (
    <section
      {...storyblokEditable(blok)}
      className={cn("w-full", backgroundClasses[background])}
    >
      <div className={cn("mx-auto space-y-4 px-4", maxWidthClasses[maxWidth])}>
        {blok.body?.map((nestedBlok) => (
          <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
        ))}
      </div>
    </section>
  );
};
