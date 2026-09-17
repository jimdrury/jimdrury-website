const STICKY_HEADER_SCROLL_GAP_PX = 24;
const SITE_HEADER_SELECTOR = "[data-site-header], body > header, header.sticky";

const prefersReducedMotion = (): boolean => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const isStickyOrFixedHeader = (header: HTMLElement): boolean => {
  const { position } = getComputedStyle(header);
  return (
    position === "sticky" ||
    position === "fixed" ||
    header.classList.contains("sticky") ||
    header.hasAttribute("data-site-header")
  );
};

const getStickyHeaderOffset = (): number => {
  let offset = 0;
  const headers = document.querySelectorAll(SITE_HEADER_SELECTOR);

  for (const header of headers) {
    if (!(header instanceof HTMLElement) || !isStickyOrFixedHeader(header)) {
      continue;
    }

    const rect = header.getBoundingClientRect();
    if (rect.bottom <= 0) {
      continue;
    }

    offset = Math.max(offset, rect.bottom);
  }

  return offset;
};

export const scrollBelowStickyHeader = (element: HTMLElement): void => {
  const offset = getStickyHeaderOffset() + STICKY_HEADER_SCROLL_GAP_PX;
  const top = Math.max(
    0,
    window.scrollY + element.getBoundingClientRect().top - offset,
  );

  window.scrollTo({
    top,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
};
