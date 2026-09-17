import "server-only";
import type { FC } from "react";

import { Hero, type HeroDensity } from "@/components/hero";
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
const COMPACT_PORTRAIT_SIZE = 720;
const HERO_PORTRAIT_QUALITY = 80;

const isHeroDensity = (value: unknown): value is HeroDensity =>
  value === "default" || value === "compact";

type HeroBlokData = SbBlokData & {
  badge?: SbBlokData[];
  title?: SbBlokData[];
  blurb?: SbBlokData[];
  portrait?: StoryblokAsset;
  density?: string;
};

type HeroBlokProps = {
  blok: HeroBlokData;
};

export const HeroBlok: FC<HeroBlokProps> = ({ blok }) => {
  const hasTitle = Array.isArray(blok.title) && blok.title.length > 0;
  const hasBlurb = Array.isArray(blok.blurb) && blok.blurb.length > 0;
  if (!hasTitle || !hasBlurb) {
    return null;
  }

  const density = isHeroDensity(blok.density) ? blok.density : "default";
  const isCompact = density === "compact";
  const portraitMax = isCompact ? COMPACT_PORTRAIT_SIZE : HERO_PORTRAIT_MAX;

  const rawSrc = blok.portrait?.filename;

  let portraitSrc: string | undefined;
  let portraitAlt: string | undefined;
  let width: number | undefined;
  let height: number | undefined;
  let portraitObjectPosition: string | undefined;

  if (rawSrc) {
    const imageDimensions = parseStoryblokImageDimensions(rawSrc);
    const portraitDimensions = imageDimensions
      ? constrainStoryblokDimensions(imageDimensions, portraitMax)
      : null;
    const sanitizedFocus = sanitizeStoryblokFocusValue(blok.portrait?.focus);
    const focalAppliedByCdn = Boolean(
      sanitizedFocus && isStoryblokImageServiceUrl(rawSrc),
    );

    portraitSrc = transformStoryblokImage(rawSrc, {
      width: portraitMax,
      height: isCompact ? COMPACT_PORTRAIT_SIZE : undefined,
      quality: HERO_PORTRAIT_QUALITY,
      focus: sanitizedFocus,
    });

    portraitObjectPosition =
      sanitizedFocus && imageDimensions && !focalAppliedByCdn
        ? storyblokFocusToObjectPositionPercent(sanitizedFocus, imageDimensions)
        : undefined;

    portraitAlt = blok.portrait?.alt || blok.portrait?.meta_data?.alt || "";
    width = isCompact
      ? COMPACT_PORTRAIT_SIZE
      : (portraitDimensions?.width ?? HERO_PORTRAIT_MAX);
    height = isCompact
      ? COMPACT_PORTRAIT_SIZE
      : (portraitDimensions?.height ?? HERO_PORTRAIT_MAX);
  }

  const badge = blok.badge?.map((nestedBlok) => (
    <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
  ));

  const title = blok.title?.map((nestedBlok) => (
    <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
  ));

  const blurb = blok.blurb?.map((nestedBlok) => (
    <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
  ));

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
      density={density}
    />
  );
};
