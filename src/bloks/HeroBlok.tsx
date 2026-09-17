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
import {
  type SbBlokData,
  type StoryRenderProps,
  storyblokEditable,
} from "@/storyblok/lib";
import { BlokRenderer } from "@/storyblok/renderer";
import type { StoryblokAsset } from "@/storyblok/types";

const HERO_PORTRAIT_MAX = 960;
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

type HeroBlokProps = StoryRenderProps & {
  blok: HeroBlokData;
};

export const HeroBlok: FC<HeroBlokProps> = ({ blok, pathname, story }) => {
  const hasTitle = Array.isArray(blok.title) && blok.title.length > 0;
  const hasBlurb = Array.isArray(blok.blurb) && blok.blurb.length > 0;
  if (!hasTitle || !hasBlurb) {
    return null;
  }

  const rawSrc = blok.portrait?.filename;

  let portraitSrc: string | undefined;
  let portraitAlt: string | undefined;
  let width: number | undefined;
  let height: number | undefined;
  let portraitObjectPosition: string | undefined;

  if (rawSrc) {
    const imageDimensions = parseStoryblokImageDimensions(rawSrc);
    const portraitDimensions = imageDimensions
      ? constrainStoryblokDimensions(imageDimensions, HERO_PORTRAIT_MAX)
      : null;
    const sanitizedFocus = sanitizeStoryblokFocusValue(blok.portrait?.focus);
    const focalAppliedByCdn = Boolean(
      sanitizedFocus && isStoryblokImageServiceUrl(rawSrc),
    );

    portraitSrc = transformStoryblokImage(rawSrc, {
      width: HERO_PORTRAIT_MAX,
      quality: HERO_PORTRAIT_QUALITY,
      focus: sanitizedFocus,
    });

    portraitObjectPosition =
      sanitizedFocus && imageDimensions && !focalAppliedByCdn
        ? storyblokFocusToObjectPositionPercent(sanitizedFocus, imageDimensions)
        : undefined;

    portraitAlt = blok.portrait?.alt || blok.portrait?.meta_data?.alt || "";
    width = portraitDimensions?.width ?? HERO_PORTRAIT_MAX;
    height = portraitDimensions?.height ?? HERO_PORTRAIT_MAX;
  }

  const badge = blok.badge?.map((nestedBlok) => (
    <BlokRenderer
      blok={nestedBlok}
      key={nestedBlok._uid}
      pathname={pathname}
      story={story}
    />
  ));

  const title = blok.title?.map((nestedBlok) => (
    <BlokRenderer
      blok={nestedBlok}
      key={nestedBlok._uid}
      pathname={pathname}
      story={story}
    />
  ));

  const blurb = blok.blurb?.map((nestedBlok) => (
    <BlokRenderer
      blok={nestedBlok}
      key={nestedBlok._uid}
      pathname={pathname}
      story={story}
    />
  ));

  const density = isHeroDensity(blok.density) ? blok.density : "default";

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
