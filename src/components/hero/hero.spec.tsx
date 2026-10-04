import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "./hero";

describe("Hero", () => {
  it("adds extra mobile space below the About copy on the default density", () => {
    const { container } = render(
      <Hero title={<h1>Jim Drury.</h1>} blurb={<p>Lede</p>} />,
    );

    const inner = container.querySelector("section > div");
    expect(inner).toHaveClass("pt-10", "pb-14");
    expect(
      screen.getByRole("heading", { name: "Jim Drury." }),
    ).toBeInTheDocument();
  });

  it("keeps compact density tighter than the homepage hero", () => {
    const { container } = render(
      <Hero
        density="compact"
        title={<h1>About</h1>}
        blurb={<p>Short lede</p>}
      />,
    );

    const inner = container.querySelector("section > div");
    expect(inner).toHaveClass("pt-6", "pb-8");
  });
});
