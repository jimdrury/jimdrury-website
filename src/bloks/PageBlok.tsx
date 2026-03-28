import "server-only";
import type { FC } from "react";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";
import { BlokRenderer } from "@/storyblok/renderer";

type PageBlokData = SbBlokData & {
  body?: SbBlokData[];
};

type PageBlokProps = {
  blok: PageBlokData;
};

export const PageBlok: FC<PageBlokProps> = ({ blok }) => {
  return (
    <main {...storyblokEditable(blok)}>
      {blok.body?.map((nestedBlok) => (
        <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </main>
  );
};
