import type { SbBlokData } from "@storyblok/react/rsc";

const WORDS_PER_MINUTE = 150;

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isSbBlokData = (value: unknown): value is SbBlokData => {
  return (
    isObject(value) &&
    typeof value.component === "string" &&
    typeof value._uid === "string"
  );
};

const extractRichText = (node: unknown): string => {
  if (!isObject(node)) {
    return "";
  }

  const parts: string[] = [];
  if (typeof node.text === "string") {
    parts.push(node.text);
  }

  if (Array.isArray(node.content)) {
    for (const child of node.content) {
      const text = extractRichText(child);
      if (text) {
        parts.push(text);
      }
    }
  }

  return parts.join(" ");
};

const extractBlokText = (blok: SbBlokData): string => {
  const parts: string[] = [];

  if (blok.component === "typography" && typeof blok.content === "string") {
    parts.push(blok.content);
  }

  if (blok.component === "rich_text") {
    parts.push(extractRichText(blok.content));
  }

  for (const value of Object.values(blok)) {
    if (!Array.isArray(value)) {
      continue;
    }

    for (const child of value) {
      if (isSbBlokData(child)) {
        const text = extractBlokText(child);
        if (text) {
          parts.push(text);
        }
      }
    }
  }

  return parts.join(" ");
};

export const estimateReadTime = (body: SbBlokData[] | undefined): number => {
  if (!body || body.length === 0) {
    return 1;
  }

  const text = body.map(extractBlokText).join(" ").trim();
  if (!text) {
    return 1;
  }

  const words = text.split(/\s+/).filter((word) => word.length > 0).length;
  if (words <= 0) {
    return 1;
  }

  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
};
