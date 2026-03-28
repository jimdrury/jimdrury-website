import "server-only";
import type { FC } from "react";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";
import { BlokRenderer } from "@/storyblok/renderer";

type GridBlokData = SbBlokData & {
  columns?: SbBlokData[];
};

type GridBlokProps = {
  blok: GridBlokData;
};

export const GridBlok: FC<GridBlokProps> = ({ blok }) => {
  return (
    <div {...storyblokEditable(blok)} className="grid gap-4 md:grid-cols-2">
      {blok.columns?.map((nestedBlok) => (
        <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
};
