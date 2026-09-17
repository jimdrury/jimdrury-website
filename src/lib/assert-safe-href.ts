const CONTROL_CHAR_MAX = 31;
const DELETE_CHAR = 127;

const hasControlOrBackslash = (value: string): boolean => {
  for (const character of value) {
    const code = character.charCodeAt(0);
    if (
      code <= CONTROL_CHAR_MAX ||
      code === DELETE_CHAR ||
      character === "\\"
    ) {
      return true;
    }
  }

  return false;
};

const isSameOriginRelativeHref = (href: string): boolean => {
  return href.startsWith("/") || href.startsWith("#");
};

export const assertSafeHref = (value: string): string => {
  const href = value.trim();

  if (!href || hasControlOrBackslash(href) || href.startsWith("//")) {
    throw new Error("Unsafe href");
  }

  if (isSameOriginRelativeHref(href)) {
    return href;
  }

  let parsed: URL;

  try {
    parsed = new URL(href);
  } catch {
    throw new Error("Unsafe href");
  }

  if (parsed.protocol !== "https:" || !parsed.hostname) {
    throw new Error("Unsafe href");
  }

  return parsed.href;
};

export const getSafeHref = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  try {
    return assertSafeHref(value);
  } catch {
    return undefined;
  }
};
