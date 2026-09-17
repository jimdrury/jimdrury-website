import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import type { SbBlokData } from "@/storyblok/lib";
import { AccoladesBlok } from "./AccoladesBlok";

vi.mock("@/storyblok/renderer", () => ({
  BlokRenderer: ({ blok }: { blok: SbBlokData }) => (
    <div data-testid={`nested-${blok.component}`}>{String(blok._uid)}</div>
  ),
}));

const renderAccolades = (blok: Parameters<typeof AccoladesBlok>[0]["blok"]) => {
  const view = AccoladesBlok({ blok }) as ReactElement;
  return render(view);
};

describe("AccoladesBlok", () => {
  it("renders the heading and nested awards", () => {
    renderAccolades({
      _uid: "accolades-1",
      component: "accolades",
      awards: [
        { _uid: "award-1", component: "award" },
        { _uid: "award-2", component: "award" },
      ],
    });

    expect(
      screen.getByRole("heading", { level: 2, name: "Accolades" }),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("nested-award")).toHaveLength(2);
    expect(screen.getAllByTestId("nested-award")[0]).toHaveTextContent(
      "award-1",
    );
  });

  it("returns null when there are no awards", () => {
    const { container } = renderAccolades({
      _uid: "accolades-2",
      component: "accolades",
      awards: [],
    });

    expect(container).toBeEmptyDOMElement();
  });
});
