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

  it("caps the featured image at 300px from the large breakpoint", () => {
    const { container } = renderHero();
    const frame = container.querySelector("header > div");

    expect(frame).toHaveClass(
      "aspect-[16/9]",
      "bg-black",
      "lg:aspect-auto",
      "lg:h-[300px]",
    );
    expect(frame).not.toHaveClass("lg:aspect-[20/7]");
    expect(screen.getByRole("img", { name: "Featured image" })).toHaveClass(
      "object-cover",
      "lg:object-contain",
    );
  });
});
