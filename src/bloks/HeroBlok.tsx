import "server-only";
import type { FC } from "react";
import { Hero } from "@/components/hero";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";
import type { StoryblokAsset } from "@/storyblok/types";

type HeroBlokData = SbBlokData & {
  title?: string;
  blurb?: string;
  portrait?: StoryblokAsset;
};

type HeroBlokProps = {
  blok: HeroBlokData;
};

export const HeroBlok: FC<HeroBlokProps> = ({ blok }) => {
  const portraitSrc = blok.portrait?.filename;

  if (!blok.title || !blok.blurb || !portraitSrc) {
    return null;
  }

  const portraitAlt =
    blok.portrait?.alt || blok.portrait?.meta_data?.alt || blok.title;

  return (
    <Hero
      {...storyblokEditable(blok)}
      title={blok.title}
      blurb={blok.blurb}
      portraitSrc={portraitSrc}
      portraitAlt={portraitAlt}
    />
  );
};
