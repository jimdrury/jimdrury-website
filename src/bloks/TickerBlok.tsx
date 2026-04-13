import "server-only";
import type { FC } from "react";
import { Ticker } from "@/components/ticker";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";
import { BlokRenderer } from "@/storyblok/renderer";

type TickerBlokData = SbBlokData & {
  items?: SbBlokData[];
};

type TickerBlokProps = {
  blok: TickerBlokData;
};

export const TickerBlok: FC<TickerBlokProps> = ({ blok }) => {
  const items =
    blok.items?.map((nestedBlok, index) => ({
      id: nestedBlok._uid ?? `ticker-item-${index}`,
      node: <BlokRenderer blok={nestedBlok} />,
    })) ?? [];

  if (!items || items.length === 0) {
    return null;
  }

  return <Ticker {...storyblokEditable(blok)} items={items} />;
};
