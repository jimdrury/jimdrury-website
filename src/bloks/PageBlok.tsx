import "server-only";
import type { FC } from "react";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";
import { BlokRenderer } from "@/storyblok/renderer";

type PageBlokData = SbBlokData & {
  header?: boolean;
  body?: SbBlokData[];
};

type PageBlokProps = {
  blok: PageBlokData;
};

export const PageBlok: FC<PageBlokProps> = ({ blok }) => {
  return (
    <main {...storyblokEditable(blok)} className="space-y-6 pb-6">
      {blok.body?.map((nestedBlok) => (
        <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </main>
  );
};
