import {
  type SbBlokData,
  StoryblokServerComponent,
  storyblokEditable,
} from "@storyblok/react/rsc";
import type { FC } from "react";

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
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
};
