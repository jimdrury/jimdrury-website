import "server-only";
import type { FC } from "react";
import { cn } from "@/lib/utils";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";

type TickerWordWeight = "regular" | "bold";

type TickerWordBlokData = SbBlokData & {
  label?: string;
  weight?: string;
};

type TickerWordBlokProps = {
  blok: TickerWordBlokData;
};

const getTickerWordWeight = (value: unknown): TickerWordWeight =>
  value === "bold" ? "bold" : "regular";

const tickerWordWeightClassName = (weight: TickerWordWeight): string => {
  switch (weight) {
    case "bold":
      return "text-[18px] font-bold tracking-[2px] lg:text-[24px]";
    case "regular":
      return "text-[13px] font-normal tracking-[2px] lg:text-2xl lg:tracking-[3px]";
    default: {
      const exhaustive: never = weight;
      return exhaustive;
    }
  }
};

export const TickerWordBlok: FC<TickerWordBlokProps> = ({ blok }) => {
  if (!blok.label) {
    return null;
  }

  const weight = getTickerWordWeight(blok.weight);

  return (
    <span
      {...storyblokEditable(blok)}
      className={cn(
        "shrink-0 font-[family-name:var(--font-anton)] uppercase leading-none",
        tickerWordWeightClassName(weight),
      )}
    >
      {blok.label}
    </span>
  );
};
