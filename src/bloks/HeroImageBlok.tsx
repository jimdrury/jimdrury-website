import "server-only";
import type { FC } from "react";
import { HeroImage } from "@/components/hero-image";
import { transformStoryblokImage } from "@/storyblok/image-transform";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";
import { BlokRenderer } from "@/storyblok/renderer";
import type { StoryblokAsset } from "@/storyblok/types";

const HERO_WIDTH = 1920;
const HERO_HEIGHT = 1080;
const HERO_QUALITY = 80;

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
      src={transformStoryblokImage(src, {
        width: HERO_WIDTH,
        height: HERO_HEIGHT,
        quality: HERO_QUALITY,
      })}
      alt={alt}
      width={HERO_WIDTH}
      height={HERO_HEIGHT}
    >
      {blok.overlay?.map((nestedBlok) => (
        <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </HeroImage>
  );
};
