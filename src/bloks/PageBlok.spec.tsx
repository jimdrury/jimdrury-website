import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { SbBlokData, StoryData } from "@/storyblok/lib";
import { PageBlok } from "./PageBlok";

vi.mock("@/storyblok/renderer", () => ({
  BlokRenderer: ({ blok }: { blok: SbBlokData }) => (
    <div data-testid={`nested-${blok.component}`}>{String(blok._uid)}</div>
  ),
}));

const privacyStory = {
  name: "Privacy Policy",
  content: { component: "page" },
  published_at: "2026-04-13T12:00:00.000Z",
} as StoryData;

const renderPage = (
  blok: Parameters<typeof PageBlok>[0]["blok"],
  story: StoryData = privacyStory,
) => {
  return render(<PageBlok blok={blok} pathname="/privacy" story={story} />);
};

describe("PageBlok", () => {
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
    renderPage(
      {
        _uid: "page-4",
        component: "page",
        header: true,
        body: [],
      },
      {
        name: "",
        content: { component: "page" },
      },
    );

    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
  });

  it("omits the last-updated subtitle when the timestamp is missing or invalid", () => {
    const { unmount } = renderPage(
      {
        _uid: "page-5",
        component: "page",
        header: true,
        body: [],
      },
      {
        name: "Privacy Policy",
        content: { component: "page" },
      },
    );

    expect(screen.queryByText(/Last updated:/)).toBeNull();
    unmount();

    renderPage(
      {
        _uid: "page-6",
        component: "page",
        header: true,
        body: [],
      },
      {
        name: "Privacy Policy",
        content: { component: "page" },
        published_at: "not-a-date",
      } as StoryData,
    );

    expect(screen.queryByText(/Last updated:/)).toBeNull();
  });

  it("does not add extra bottom padding above the site footer", () => {
    const { container } = renderPage({
      _uid: "page-7",
      component: "page",
      header: false,
      body: [],
    });

    expect(container.querySelector("main")).not.toHaveClass("pb-6");
  });
});
