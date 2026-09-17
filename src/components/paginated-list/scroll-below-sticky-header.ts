const STICKY_HEADER_SCROLL_GAP_PX = 16;

const parsePx = (value: string): number => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const prefersReducedMotion = (): boolean => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const getStickyHeaderOffset = (): number => {
  const header = document.querySelector("header");
  if (!(header instanceof HTMLElement)) {
    return 0;
  }

  const { position } = getComputedStyle(header);
  if (position !== "sticky" && position !== "fixed") {
    return 0;
  }

  return Math.max(0, header.getBoundingClientRect().bottom);
};

const getDocumentScrollPaddingTop = (): number => {
  return parsePx(getComputedStyle(document.documentElement).scrollPaddingTop);
};

export const scrollBelowStickyHeader = (element: HTMLElement): void => {
  const headerOffset = getStickyHeaderOffset();
  const scrollPaddingTop = getDocumentScrollPaddingTop();
  const scrollMarginTop = Math.max(
    0,
    headerOffset + STICKY_HEADER_SCROLL_GAP_PX - scrollPaddingTop,
  );

  element.style.scrollMarginTop = `${scrollMarginTop}px`;
  element.scrollIntoView({
    block: "start",
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
};
