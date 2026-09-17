import "server-only";
import type { FC } from "react";
import { Ticker } from "@/components/ticker";
import {
  type SbBlokData,
  type StoryRenderProps,
  storyblokEditable,
} from "@/storyblok/lib";
import { BlokRenderer } from "@/storyblok/renderer";

type TickerBlokData = SbBlokData & {
  items?: SbBlokData[];
};

type TickerBlokProps = StoryRenderProps & {
  blok: TickerBlokData;
};

export const TickerBlok: FC<TickerBlokProps> = ({ blok, pathname, story }) => {
  const items =
    blok.items?.map((nestedBlok, index) => ({
      id: nestedBlok._uid ?? `ticker-item-${index}`,
      node: (
        <BlokRenderer blok={nestedBlok} pathname={pathname} story={story} />
      ),
    })) ?? [];

  if (!items || items.length === 0) {
    return null;
  }

  return <Ticker {...storyblokEditable(blok)} items={items} />;
};
