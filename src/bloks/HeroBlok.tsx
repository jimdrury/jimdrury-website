import "server-only";
import type { FC } from "react";

import { Hero } from "@/components/hero";
import {
  sanitizeStoryblokFocusValue,
  storyblokFocusToObjectPositionPercent,
} from "@/storyblok/asset-focus";
import { parseStoryblokImageDimensions } from "@/storyblok/image-dimensions";
import {
  constrainStoryblokDimensions,
  isStoryblokImageServiceUrl,
  transformStoryblokImage,
} from "@/storyblok/image-transform";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";
import { BlokRenderer } from "@/storyblok/renderer";
import type { StoryblokAsset } from "@/storyblok/types";

const HERO_PORTRAIT_MAX = 960;
const HERO_PORTRAIT_QUALITY = 80;

type HeroBlokData = SbBlokData & {
  badge?: SbBlokData[];
  title?: SbBlokData[];
  blurb?: SbBlokData[];
  portrait?: StoryblokAsset;
};

type HeroBlokProps = {
  blok: HeroBlokData;
};

export const HeroBlok: FC<HeroBlokProps> = ({ blok }) => {
  const rawSrc = blok.portrait?.filename;
  const hasTitle = Array.isArray(blok.title) && blok.title.length > 0;
  const hasBlurb = Array.isArray(blok.blurb) && blok.blurb.length > 0;
  if (!hasTitle || !rawSrc || !hasBlurb) {
    return null;
  }

  const imageDimensions = parseStoryblokImageDimensions(rawSrc);
  const portraitDimensions = imageDimensions
    ? constrainStoryblokDimensions(imageDimensions, HERO_PORTRAIT_MAX)
    : null;
  const sanitizedFocus = sanitizeStoryblokFocusValue(blok.portrait?.focus);
  const focalAppliedByCdn = Boolean(
    sanitizedFocus && isStoryblokImageServiceUrl(rawSrc),
  );
  const portraitSrc = transformStoryblokImage(rawSrc, {
    width: HERO_PORTRAIT_MAX,
    quality: HERO_PORTRAIT_QUALITY,
    focus: sanitizedFocus,
  });
  const portraitObjectPosition =
    sanitizedFocus && imageDimensions && !focalAppliedByCdn
      ? storyblokFocusToObjectPositionPercent(sanitizedFocus, imageDimensions)
      : undefined;

  const portraitAlt = blok.portrait?.alt || blok.portrait?.meta_data?.alt || "";

  const badge = blok.badge?.map((nestedBlok) => (
    <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
  ));

  const title = blok.title?.map((nestedBlok) => (
    <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
  ));

  const blurb = blok.blurb?.map((nestedBlok) => (
    <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
  ));

  const width = portraitDimensions?.width ?? HERO_PORTRAIT_MAX;
  const height = portraitDimensions?.height ?? HERO_PORTRAIT_MAX;

  return (
    <Hero
      {...storyblokEditable(blok)}
      badge={badge}
      title={title}
      blurb={blurb}
      portraitSrc={portraitSrc}
      portraitAlt={portraitAlt}
      portraitWidth={width}
      portraitHeight={height}
      portraitObjectPosition={portraitObjectPosition}
    />
  );
};
