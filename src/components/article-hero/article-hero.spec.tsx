import { render, screen } from "@testing-library/react";
import type { ImgHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";
import { ArticleHero } from "./article-hero";

vi.mock("next/image", () => ({
  default: ({
    alt,
    ...props
  }: ImgHTMLAttributes<HTMLImageElement> & { alt: string }) => (
    // biome-ignore lint/performance/noImgElement: next/image mock for unit tests
    <img alt={alt} {...props} />
  ),
}));

const renderHero = () =>
  render(
    <ArticleHero
      src="/hero.jpg"
      alt="Featured image"
      title="Wide screen article"
      excerpt="A short summary"
      categories={["Design"]}
    />,
  );

describe("ArticleHero", () => {
  it("renders the title and featured image", () => {
    renderHero();

    expect(
      screen.getAllByRole("heading", { name: "Wide screen article" }),
    ).toHaveLength(2);
    expect(screen.getByRole("img", { name: "Featured image" })).toHaveAttribute(
      "src",
      "/hero.jpg",
    );
  });

  it("caps the featured image at 600px from the large breakpoint", () => {
    const { container } = renderHero();
    const frame = container.querySelector("header > div");

    expect(frame).toHaveClass(
      "aspect-[16/9]",
      "bg-black",
      "lg:aspect-auto",
      "lg:h-[600px]",
    );
    expect(frame).not.toHaveClass("lg:aspect-[20/7]");
    expect(screen.getByRole("img", { name: "Featured image" })).toHaveClass(
      "object-cover",
      "object-center",
    );
    expect(screen.getByRole("img", { name: "Featured image" })).not.toHaveClass(
      "lg:object-contain",
    );
  });

  it("pins the desktop title card to the left over the banner", () => {
    const { container } = renderHero();
    const desktopCard = container.querySelector("header .lg\\:block");

    expect(desktopCard).toHaveClass(
      "absolute",
      "-bottom-32",
      "-left-[3px]",
      "lg:block",
    );
    expect(desktopCard).not.toHaveClass("relative", "lg:-mt-8", "mx-auto");
  });
});
