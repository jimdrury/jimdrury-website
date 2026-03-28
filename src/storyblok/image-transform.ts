import "server-only";
import type { StoryblokImageDimensions } from "@/storyblok/image-dimensions";

const STORYBLOK_ASSET_HOST = "a.storyblok.com";

type StoryblokTransformOptions = {
  width: number;
  height?: number;
  quality?: number;
};

const isStoryblokAsset = (value: string): boolean => {
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
  if (!isStoryblokAsset(src)) {
    return src;
  }

  const width = sanitizePositiveInteger(options.width);
  if (width <= 0) {
    return src;
  }

  const height = sanitizePositiveInteger(options.height ?? 0);
  const quality = sanitizePositiveInteger(options.quality ?? 0);
  const base = src.split("/m/")[0] ?? src;
  const qualitySegment =
    quality > 0 ? `/filters:quality(${Math.min(quality, 100)})` : "";

  return `${base}/m/${width}x${height}${qualitySegment}`;
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
