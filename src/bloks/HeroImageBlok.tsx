import "server-only";
import {
  type SbBlokData,
  StoryblokServerComponent,
  storyblokEditable,
} from "@storyblok/react/rsc";
import type { FC } from "react";
import { HeroImage } from "@/components/hero-image";
import type { StoryblokAsset } from "@/storyblok/types";

const HERO_WIDTH = 1920;
const HERO_HEIGHT = 1080;

const toHeroSrc = (url: string) => `${url}/m/${HERO_WIDTH}x${HERO_HEIGHT}`;

type HeroImageBlokData = SbBlokData & {
  image?: StoryblokAsset;
  overlay?: SbBlokData[];
};

type HeroImageBlokProps = {
  blok: HeroImageBlokData;
};

export const HeroImageBlok: FC<HeroImageBlokProps> = ({ blok }) => {
  const src = blok.image?.filename;
  const alt = blok.image?.alt || blok.image?.meta_data?.alt || "Image";

  if (!src) {
    return null;
  }

  return (
    <HeroImage
      {...storyblokEditable(blok)}
      src={toHeroSrc(src)}
      alt={alt}
      width={HERO_WIDTH}
      height={HERO_HEIGHT}
    >
      {blok.overlay?.map((nestedBlok) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </HeroImage>
  );
};
