import type { StoryblokImageDimensions } from "./image-dimensions";

/** Storyblok asset `focus`: `WxH:WxH` rectangle or `WxH` point (pixels on the original). */
const STORYBLOK_FOCUS_PATTERN = /^(\d+)x(\d+)(?::(\d+)x(\d+))?$/;

export const sanitizeStoryblokFocusValue = (
  focus: string | undefined | null,
): string | undefined => {
  if (focus == null || focus === "") {
    return undefined;
  }
  const trimmed = focus.trim();
  return STORYBLOK_FOCUS_PATTERN.test(trimmed) ? trimmed : undefined;
};

/**
 * CSS `object-position` for `object-fit: cover` when not using the Storyblok
 * image service focal filter (e.g. external asset URLs).
 */
export const storyblokFocusToObjectPositionPercent = (
  focus: string,
  dimensions: StoryblokImageDimensions,
): string | undefined => {
  const match = focus.trim().match(STORYBLOK_FOCUS_PATTERN);
  if (!match || dimensions.width <= 0 || dimensions.height <= 0) {
    return undefined;
  }

  const x1 = Number.parseInt(match[1], 10);
  const y1 = Number.parseInt(match[2], 10);
  const x2 = match[3] !== undefined ? Number.parseInt(match[3], 10) : x1;
  const y2 = match[4] !== undefined ? Number.parseInt(match[4], 10) : y1;
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  const pctX = (cx / dimensions.width) * 100;
  const pctY = (cy / dimensions.height) * 100;

  return `${pctX}% ${pctY}%`;
};
