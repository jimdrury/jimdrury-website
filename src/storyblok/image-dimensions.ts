export type StoryblokImageDimensions = {
  width: number;
  height: number;
};

export const parseStoryblokImageDimensions = (
  url: string | undefined,
): StoryblokImageDimensions | null => {
  if (!url) {
    return null;
  }

  const match = url.match(/\/(\d+)x(\d+)\//);
  if (!match) {
    return null;
  }

  const width = Number.parseInt(match[1], 10);
  const height = Number.parseInt(match[2], 10);

  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    return null;
  }

  if (width <= 0 || height <= 0) {
    return null;
  }

  return { width, height };
};
