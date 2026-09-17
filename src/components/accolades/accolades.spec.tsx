import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Accolades } from "./accolades";

describe("Accolades", () => {
  it("renders the default heading and nested awards", () => {
    const { container } = render(
      <Accolades>
        <p>Storyblok MVP 2025</p>
      </Accolades>,
    );

    expect(container.querySelector("section")).toHaveClass(
      "bg-[var(--bg-secondary)]",
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Accolades" }),
    ).toHaveClass("uppercase");
    expect(screen.getByText("Storyblok MVP 2025")).toBeInTheDocument();
  });

  it("uses a custom title when provided", () => {
    render(<Accolades title="Proof" />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Proof" }),
    ).toBeInTheDocument();
  });
});
