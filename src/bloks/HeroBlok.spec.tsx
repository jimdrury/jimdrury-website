import { render, screen } from "@testing-library/react";
import type { ImgHTMLAttributes, ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import type { SbBlokData } from "@/storyblok/lib";
import { HeroBlok } from "./HeroBlok";

vi.mock("next/image", () => ({
  default: ({
    alt,
    ...props
  }: ImgHTMLAttributes<HTMLImageElement> & { alt: string }) => (
    // biome-ignore lint/performance/noImgElement: next/image mock for unit tests
    <img alt={alt} {...props} />
  ),
}));

vi.mock("@/storyblok/renderer", () => ({
  BlokRenderer: ({ blok }: { blok: SbBlokData }) => (
    <span>{String(blok._uid)}</span>
  ),
}));

const renderHero = (blok: Parameters<typeof HeroBlok>[0]["blok"]) => {
  const view = HeroBlok({ blok }) as ReactElement;
  return render(view);
};

const portraitSrc =
  "https://a.storyblok.com/f/291093583118629/1348x1348/d76f7ae056/profile-picture.jpg";

describe("HeroBlok", () => {
  it("crops compact portraits to 720x720", () => {
    renderHero({
      component: "hero",
      density: "compact",
      title: [{ _uid: "title-1", component: "typography" }],
      blurb: [{ _uid: "blurb-1", component: "rich_text" }],
      portrait: {
        filename: portraitSrc,
        alt: "Jim Drury speaking into a microphone.",
      },
    });

    const image = screen.getByRole("img", {
      name: "Jim Drury speaking into a microphone.",
    });
    expect(image).toHaveAttribute("width", "720");
    expect(image).toHaveAttribute("height", "720");
    expect(image.getAttribute("src")).toContain("/m/720x720/");
  });
});
