import "server-only";
import type { FC } from "react";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";

type TickerWordBlokData = SbBlokData & {
  label?: string;
};

type TickerWordBlokProps = {
  blok: TickerWordBlokData;
};

export const TickerWordBlok: FC<TickerWordBlokProps> = ({ blok }) => {
  if (!blok.label) {
    return null;
  }

  return (
    <span
      {...storyblokEditable(blok)}
      className="shrink-0 font-[family-name:var(--font-anton)] text-[13px] font-normal uppercase leading-none tracking-[2px] lg:text-2xl lg:tracking-[3px]"
    >
      {blok.label}
    </span>
  );
};
