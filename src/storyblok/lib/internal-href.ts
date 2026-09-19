const INTERNAL_HOSTS = new Set(["www.jimdrury.co.uk", "jimdrury.co.uk"]);

const PROTOCOL_PATTERN = /^[a-z][a-z0-9+.-]*:/i;
const STORY_SLUG_PATTERN =
  /^[A-Za-z0-9._~-]+(?:\/[A-Za-z0-9._~-]*)*(?:[?#][^\s]*)?$/;

const normalizeHomePath = (href: string): string => {
  const match = href.match(/^([^?#]*)(.*)$/);
  const pathname = match?.[1] ?? href;
  const rest = match?.[2] ?? "";
  const normalized =
    pathname === "/home" || pathname === "/home/" ? "/" : pathname;

  return `${normalized}${rest}`;
};

const withLeadingSlash = (href: string): string => {
  if (
    href.startsWith("/") ||
    href.startsWith("#") ||
    PROTOCOL_PATTERN.test(href)
  ) {
    return href;
  }

  return `/${href}`;
};

const isStoryLikeHref = (href: string): boolean => {
  if (
    href.startsWith("/") ||
    href.startsWith("#") ||
    href.startsWith("//") ||
    PROTOCOL_PATTERN.test(href)
  ) {
    return false;
  }

  return STORY_SLUG_PATTERN.test(href);
};

export const normalizeRichTextHref = (
  href: unknown,
  linktype?: unknown,
  anchor?: unknown,
): string | undefined => {
  const rawHref = typeof href === "string" ? href.trim() : "";
  const rawAnchor = typeof anchor === "string" ? anchor.trim() : "";
  const isStory = linktype === "story";

  let normalized = rawHref;

  if (normalized && (isStory || isStoryLikeHref(normalized))) {
    normalized = withLeadingSlash(normalized);
  }

  if (rawAnchor && normalized && !normalized.includes("#")) {
    normalized = `${normalized}#${rawAnchor}`;
  } else if (rawAnchor && !normalized) {
    normalized = `#${rawAnchor}`;
  }

  return normalized || undefined;
};

export const getNextLinkHref = (href: string): string | undefined => {
  const trimmed = href.trim();

  if (!trimmed || trimmed.startsWith("#")) {
    return undefined;
  }

  if (trimmed.startsWith("/")) {
    return normalizeHomePath(trimmed);
  }

  if (isStoryLikeHref(trimmed)) {
    return normalizeHomePath(withLeadingSlash(trimmed));
  }

  let parsed: URL;

  try {
    parsed = new URL(trimmed);
  } catch {
    return undefined;
  }

  if (parsed.protocol !== "https:" || !INTERNAL_HOSTS.has(parsed.hostname)) {
    return undefined;
  }

  const path = `${parsed.pathname}${parsed.search}${parsed.hash}` || "/";
  return normalizeHomePath(path);
};
