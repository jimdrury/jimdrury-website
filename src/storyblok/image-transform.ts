import "server-only";
import { sanitizeStoryblokFocusValue } from "@/storyblok/asset-focus";
import type { StoryblokImageDimensions } from "@/storyblok/image-dimensions";

const STORYBLOK_ASSET_HOST = "a.storyblok.com";

type StoryblokTransformOptions = {
  width: number;
  height?: number;
  quality?: number;
  /** Storyblok asset `focus` string; appended as `filters:focal(...)` when valid. */
  focus?: string | null;
};

export const isStoryblokImageServiceUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.hostname === STORYBLOK_ASSET_HOST;
  } catch {
    return false;
  }
};

const sanitizePositiveInteger = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.trunc(value));
};

export const transformStoryblokImage = (
  src: string,
  options: StoryblokTransformOptions,
): string => {
  if (!isStoryblokImageServiceUrl(src)) {
    return src;
  }

  const width = sanitizePositiveInteger(options.width);
  if (width <= 0) {
    return src;
  }

  const height = sanitizePositiveInteger(options.height ?? 0);
  const quality = sanitizePositiveInteger(options.quality ?? 0);
  const base = src.split("/m/")[0] ?? src;
  const sanitizedFocus = sanitizeStoryblokFocusValue(
    options.focus ?? undefined,
  );

  const filterParts: string[] = [];
  if (quality > 0) {
    filterParts.push(`quality(${Math.min(quality, 100)})`);
  }
  if (sanitizedFocus) {
    filterParts.push(`focal(${sanitizedFocus})`);
  }

  const filtersSegment =
    filterParts.length > 0 ? `/filters:${filterParts.join(":")}` : "";

  return `${base}/m/${width}x${height}${filtersSegment}`;
};

export const constrainStoryblokDimensions = (
  dimensions: StoryblokImageDimensions,
  maxWidth: number,
): StoryblokImageDimensions => {
  const safeMaxWidth = sanitizePositiveInteger(maxWidth);

  if (safeMaxWidth <= 0 || dimensions.width <= safeMaxWidth) {
    return dimensions;
  }

  const ratio = dimensions.height / dimensions.width;
  const constrainedHeight = Math.max(1, Math.round(safeMaxWidth * ratio));

  return {
    width: safeMaxWidth,
    height: constrainedHeight,
  };
};
