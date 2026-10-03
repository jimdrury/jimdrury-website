import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionTitle } from "./section-title";

describe("SectionTitle", () => {
  it("renders a 4xl homepage section heading", () => {
    render(<SectionTitle>Recent Writing</SectionTitle>);

    const heading = screen.getByRole("heading", {
      level: 2,
      name: "Recent Writing",
    });

    expect(heading).toHaveClass("text-[length:var(--text-4xl)]", "font-medium");
    expect(heading).not.toHaveClass("text-[48px]", "uppercase");
  });
});
