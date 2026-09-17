import { render, screen } from "@testing-library/react";
import { notFound } from "next/navigation";
import type { FC } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { isBlogStory, useStoryRenderContext } from "@/lib/story-render-context";
import { createStoryContent, parseStoryContent } from "./create-story-content";
import type { SbBlokData } from "./types";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  }),
}));

const FakeBlok: FC<{ blok: SbBlokData }> = ({ blok }) => {
  const { pathname, story } = useStoryRenderContext();

  return (
    <div>
      <span data-testid="blok">{blok.component}</span>
      <span data-testid="pathname">{pathname}</span>
      <span data-testid="article">{String(isBlogStory(story))}</span>
    </div>
  );
};

const StoryContent = createStoryContent(FakeBlok);

describe("parseStoryContent", () => {
  it("returns blok data when content is already an object", () => {
    expect(
      parseStoryContent({
        content: { component: "page", _uid: "page-1" },
      }),
    ).toEqual({ component: "page", _uid: "page-1" });
  });

  it("parses JSON string content", () => {
    expect(
      parseStoryContent({
        content: JSON.stringify({ component: "article", _uid: "article-1" }),
      }),
    ).toEqual({ component: "article", _uid: "article-1" });
  });

  it("returns null for invalid objects, JSON, and parse errors", () => {
    expect(parseStoryContent({ content: { _uid: "no-component" } })).toBeNull();
    expect(parseStoryContent({ content: "{}" })).toBeNull();
    expect(parseStoryContent({ content: "not-json" })).toBeNull();
    expect(parseStoryContent({ content: null })).toBeNull();
  });
});

describe("createStoryContent", () => {
  beforeEach(() => {
    vi.mocked(notFound).mockClear();
  });

  it("renders the root blok inside the story provider", () => {
    render(
      <StoryContent
        mode="published"
        pathname="/about"
        story={{
          name: "About",
          content: { component: "page", _uid: "page-1" },
        }}
      />,
    );

    expect(screen.getByTestId("blok")).toHaveTextContent("page");
    expect(screen.getByTestId("pathname")).toHaveTextContent("/about");
    expect(screen.getByTestId("article")).toHaveTextContent("false");
    expect(notFound).not.toHaveBeenCalled();
  });

  it("exposes parsed JSON article content to descendants", () => {
    render(
      <StoryContent
        mode="published"
        pathname="/blog/shipping-agents"
        story={{
          name: "Shipping agents",
          content: JSON.stringify({ component: "article", body: [] }),
        }}
      />,
    );

    expect(screen.getByTestId("blok")).toHaveTextContent("article");
    expect(screen.getByTestId("pathname")).toHaveTextContent(
      "/blog/shipping-agents",
    );
    expect(screen.getByTestId("article")).toHaveTextContent("true");
  });

  it("calls notFound when published content cannot be parsed", () => {
    expect(() =>
      render(
        <StoryContent
          mode="published"
          pathname="/about"
          story={{ name: "About", content: "not-json" }}
        />,
      ),
    ).toThrow(/NEXT_HTTP_ERROR_FALLBACK;404/);

    expect(notFound).toHaveBeenCalled();
  });

  it("shows a visible preview error when draft content cannot be parsed", () => {
    render(
      <StoryContent
        mode="draft"
        pathname="/about"
        story={{ name: "Broken draft", content: { title: "no component" } }}
      />,
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("This draft could not be rendered.");
    expect(alert).toHaveTextContent("Broken draft");
    expect(screen.queryByTestId("blok")).toBeNull();
    expect(notFound).not.toHaveBeenCalled();
  });
});
