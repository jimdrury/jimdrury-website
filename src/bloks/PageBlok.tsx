import {
  type SbBlokData,
  StoryblokServerComponent,
  storyblokEditable,
} from "@storyblok/react/rsc";
import type { FC } from "react";

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
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </main>
  );
};
