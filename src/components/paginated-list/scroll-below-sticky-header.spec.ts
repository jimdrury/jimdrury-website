import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { scrollBelowStickyHeader } from "./scroll-below-sticky-header";

const HEADER_HEIGHT = 80;
const LIST_SCROLL_GAP_PX = 24;
const WINDOW_SCROLL_Y = 800;
const TARGET_VIEWPORT_TOP = 200;

const expectedTop = (headerOffset = 0) =>
  WINDOW_SCROLL_Y + TARGET_VIEWPORT_TOP - headerOffset - LIST_SCROLL_GAP_PX;

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
  let scrollTo: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    stubMatchMedia(false);
    scrollTo = vi.fn();
    vi.stubGlobal("scrollTo", scrollTo);
    vi.stubGlobal("scrollY", WINDOW_SCROLL_Y);
    vi.spyOn(window, "getComputedStyle").mockImplementation((element) => {
      if (element instanceof HTMLElement && element.tagName === "HEADER") {
        return {
          position: element.dataset.position ?? "sticky",
        } as CSSStyleDeclaration;
      }

      return originalGetComputedStyle(element);
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it("scrolls the element below a sticky header", () => {
    const header = document.createElement("header");
    header.dataset.position = "sticky";
    document.body.append(header);
    vi.spyOn(header, "getBoundingClientRect").mockReturnValue(
      createRect(0, HEADER_HEIGHT),
    );

    const target = document.createElement("div");
    document.body.append(target);
    vi.spyOn(target, "getBoundingClientRect").mockReturnValue(
      createRect(TARGET_VIEWPORT_TOP, 400),
    );

    scrollBelowStickyHeader(target);

    expect(scrollTo).toHaveBeenCalledWith({
      top: expectedTop(HEADER_HEIGHT),
      behavior: "smooth",
    });
  });

  it("uses instant scrolling when the user prefers reduced motion", () => {
    stubMatchMedia(true);

    const target = document.createElement("div");
    document.body.append(target);
    vi.spyOn(target, "getBoundingClientRect").mockReturnValue(
      createRect(TARGET_VIEWPORT_TOP, 400),
    );

    scrollBelowStickyHeader(target);

    expect(scrollTo).toHaveBeenCalledWith({
      top: expectedTop(),
      behavior: "auto",
    });
  });

  it("ignores nested non-sticky headers so in-page section headers do not steal the offset", () => {
    const siteHeader = document.createElement("header");
    siteHeader.dataset.position = "sticky";
    document.body.append(siteHeader);
    vi.spyOn(siteHeader, "getBoundingClientRect").mockReturnValue(
      createRect(0, HEADER_HEIGHT),
    );

    const section = document.createElement("section");
    const nestedHeader = document.createElement("header");
    nestedHeader.dataset.position = "static";
    section.append(nestedHeader);
    document.body.append(section);
    vi.spyOn(nestedHeader, "getBoundingClientRect").mockReturnValue(
      createRect(400, 40),
    );

    const target = document.createElement("div");
    document.body.append(target);
    vi.spyOn(target, "getBoundingClientRect").mockReturnValue(
      createRect(TARGET_VIEWPORT_TOP, 400),
    );

    scrollBelowStickyHeader(target);

    expect(scrollTo).toHaveBeenCalledWith({
      top: expectedTop(HEADER_HEIGHT),
      behavior: "smooth",
    });
  });

  it("still offsets by the sticky header when the document already has scroll-padding", () => {
    const header = document.createElement("header");
    header.setAttribute("data-site-header", "");
    header.dataset.position = "sticky";
    document.body.append(header);
    vi.spyOn(header, "getBoundingClientRect").mockReturnValue(
      createRect(0, HEADER_HEIGHT),
    );

    const target = document.createElement("div");
    document.body.append(target);
    vi.spyOn(target, "getBoundingClientRect").mockReturnValue(
      createRect(TARGET_VIEWPORT_TOP, 400),
    );

    scrollBelowStickyHeader(target);

    expect(scrollTo).toHaveBeenCalledWith({
      top: expectedTop(HEADER_HEIGHT),
      behavior: "smooth",
    });
  });
});
