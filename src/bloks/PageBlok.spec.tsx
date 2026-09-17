import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SbBlokData } from "@/storyblok/lib";
import { PageBlok } from "./PageBlok";

const storyContext = vi.hoisted(() => ({
  getCurrentStoryName: vi.fn(() => "Privacy Policy"),
  getCurrentStoryUpdatedAt: vi.fn(() => "2026-04-13T12:00:00.000Z"),
}));

vi.mock("@/lib/current-story-context", () => ({
  getCurrentStoryName: () => storyContext.getCurrentStoryName(),
  getCurrentStoryUpdatedAt: () => storyContext.getCurrentStoryUpdatedAt(),
}));

vi.mock("@/storyblok/renderer", () => ({
  BlokRenderer: ({ blok }: { blok: SbBlokData }) => (
    <div data-testid={`nested-${blok.component}`}>{String(blok._uid)}</div>
  ),
}));

const renderPage = (blok: Parameters<typeof PageBlok>[0]["blok"]) => {
  const view = PageBlok({ blok }) as ReactElement;
  return render(view);
};

describe("PageBlok", () => {
  beforeEach(() => {
    storyContext.getCurrentStoryName.mockReturnValue("Privacy Policy");
    storyContext.getCurrentStoryUpdatedAt.mockReturnValue(
      "2026-04-13T12:00:00.000Z",
    );
  });

  it("renders the page title banner when header is true", () => {
    renderPage({
      _uid: "page-1",
      component: "page",
      header: true,
      body: [{ _uid: "body-1", component: "rich_text" }],
    });

    expect(
      screen.getByRole("heading", { level: 1, name: "Privacy Policy" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Last updated: 13 Apr 2026")).toBeInTheDocument();
    expect(screen.getByTestId("nested-rich_text")).toHaveTextContent("body-1");
  });

  it("renders the title banner by default when header is omitted", () => {
    renderPage({
      _uid: "page-2",
      component: "page",
      body: [],
    });

    expect(
      screen.getByRole("heading", { level: 1, name: "Privacy Policy" }),
    ).toBeInTheDocument();
  });

  it("does not render the title banner when header is false", () => {
    renderPage({
      _uid: "page-3",
      component: "page",
      header: false,
      body: [{ _uid: "body-2", component: "hero" }],
    });

    expect(
      screen.queryByRole("heading", { level: 1, name: "Privacy Policy" }),
    ).toBeNull();
    expect(screen.getByTestId("nested-hero")).toHaveTextContent("body-2");
  });

  it("omits the banner when the story has no title", () => {
    storyContext.getCurrentStoryName.mockReturnValue("");

    renderPage({
      _uid: "page-4",
      component: "page",
      header: true,
      body: [],
    });

    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
  });

  it("omits the last-updated subtitle when the timestamp is missing or invalid", () => {
    storyContext.getCurrentStoryUpdatedAt.mockReturnValue("");

    const { unmount } = renderPage({
      _uid: "page-5",
      component: "page",
      header: true,
      body: [],
    });

    expect(screen.queryByText(/Last updated:/)).toBeNull();
    unmount();

    storyContext.getCurrentStoryUpdatedAt.mockReturnValue("not-a-date");
    renderPage({
      _uid: "page-6",
      component: "page",
      header: true,
      body: [],
    });

    expect(screen.queryByText(/Last updated:/)).toBeNull();
  });
});
