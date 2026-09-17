import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { scrollBelowStickyHeader } from "./scroll-below-sticky-header";

const HEADER_HEIGHT = 80;
const LIST_SCROLL_GAP_PX = 16;

const createRect = (top: number, height: number): DOMRect => {
  return {
    x: 0,
    y: top,
    top,
    bottom: top + height,
    left: 0,
    right: 0,
    width: 0,
    height,
    toJSON: () => ({}),
  } as DOMRect;
};

const stubMatchMedia = (reducedMotion: boolean) => {
  vi.stubGlobal(
    "matchMedia",
    (query: string): MediaQueryList =>
      ({
        matches: query.includes("prefers-reduced-motion: reduce")
          ? reducedMotion
          : false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as MediaQueryList,
  );
};

describe("scrollBelowStickyHeader", () => {
  const originalGetComputedStyle = window.getComputedStyle;

  beforeEach(() => {
    stubMatchMedia(false);
    vi.spyOn(window, "getComputedStyle").mockImplementation((element) => {
      if (element instanceof HTMLElement && element.tagName === "HEADER") {
        return {
          position: element.dataset.position ?? "sticky",
          scrollPaddingTop: "0px",
        } as CSSStyleDeclaration;
      }

      if (element === document.documentElement) {
        return {
          position: "static",
          scrollPaddingTop: document.documentElement.dataset.scrollPaddingTop
            ? `${document.documentElement.dataset.scrollPaddingTop}px`
            : "0px",
        } as CSSStyleDeclaration;
      }

      return originalGetComputedStyle(element);
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    document.body.replaceChildren();
    document.documentElement.removeAttribute("data-scroll-padding-top");
  });

  it("scrolls the element into view below a sticky header", () => {
    const header = document.createElement("header");
    header.dataset.position = "sticky";
    document.body.append(header);
    vi.spyOn(header, "getBoundingClientRect").mockReturnValue(
      createRect(0, HEADER_HEIGHT),
    );

    const target = document.createElement("div");
    document.body.append(target);
    const scrollIntoView = vi
      .spyOn(target, "scrollIntoView")
      .mockImplementation(() => undefined);

    scrollBelowStickyHeader(target);

    expect(target.style.scrollMarginTop).toBe(
      `${HEADER_HEIGHT + LIST_SCROLL_GAP_PX}px`,
    );
    expect(scrollIntoView).toHaveBeenCalledWith({
      block: "start",
      behavior: "smooth",
    });
  });

  it("uses instant scrolling when the user prefers reduced motion", () => {
    stubMatchMedia(true);

    const target = document.createElement("div");
    document.body.append(target);
    const scrollIntoView = vi
      .spyOn(target, "scrollIntoView")
      .mockImplementation(() => undefined);

    scrollBelowStickyHeader(target);

    expect(scrollIntoView).toHaveBeenCalledWith({
      block: "start",
      behavior: "auto",
    });
  });

  it("does not add header height when the header is not sticky or fixed", () => {
    const header = document.createElement("header");
    header.dataset.position = "static";
    document.body.append(header);
    vi.spyOn(header, "getBoundingClientRect").mockReturnValue(
      createRect(0, HEADER_HEIGHT),
    );

    const target = document.createElement("div");
    document.body.append(target);
    vi.spyOn(target, "scrollIntoView").mockImplementation(() => undefined);

    scrollBelowStickyHeader(target);

    expect(target.style.scrollMarginTop).toBe(`${LIST_SCROLL_GAP_PX}px`);
  });

  it("subtracts existing document scroll-padding so hash-link offset is not doubled", () => {
    document.documentElement.dataset.scrollPaddingTop = String(HEADER_HEIGHT);

    const header = document.createElement("header");
    header.dataset.position = "sticky";
    document.body.append(header);
    vi.spyOn(header, "getBoundingClientRect").mockReturnValue(
      createRect(0, HEADER_HEIGHT),
    );

    const target = document.createElement("div");
    document.body.append(target);
    vi.spyOn(target, "scrollIntoView").mockImplementation(() => undefined);

    scrollBelowStickyHeader(target);

    expect(target.style.scrollMarginTop).toBe(`${LIST_SCROLL_GAP_PX}px`);
  });
});
