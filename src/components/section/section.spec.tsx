import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Section } from "./section";

const inner = (element: HTMLElement) => {
  const content = element.querySelector(":scope > div");
  if (!(content instanceof HTMLElement)) {
    throw new Error("expected section inner wrapper");
  }
  return content;
};

describe("Section", () => {
  it("renders children inside a section", () => {
    render(<Section>Body</Section>);

    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("defaults inner content to a centered 3xl max width", () => {
    render(<Section data-testid="section">Body</Section>);

    expect(inner(screen.getByTestId("section"))).toHaveClass(
      "mx-auto",
      "w-full",
      "max-w-3xl",
    );
  });

  it("applies the selected max width class on the inner wrapper", () => {
    render(
      <Section data-testid="section" maxWidth="lg">
        Body
      </Section>,
    );

    expect(inner(screen.getByTestId("section"))).toHaveClass("max-w-lg");
    expect(inner(screen.getByTestId("section"))).not.toHaveClass("max-w-3xl");
  });

  it("uses full width when maxWidth is full", () => {
    render(
      <Section data-testid="section" maxWidth="full">
        Body
      </Section>,
    );

    expect(inner(screen.getByTestId("section"))).toHaveClass("max-w-full");
  });

  it("falls back to 3xl when maxWidth is not a known option", () => {
    render(
      <Section data-testid="section" maxWidth={"unknown" as "3xl"}>
        Body
      </Section>,
    );

    expect(inner(screen.getByTestId("section"))).toHaveClass("max-w-3xl");
  });

  it("applies background and padding on the outer section", () => {
    render(
      <Section
        data-testid="section"
        background="yellow"
        paddingTop="lg"
        paddingBottom="sm"
      >
        Body
      </Section>,
    );

    expect(screen.getByTestId("section")).toHaveClass(
      "bg-[var(--bg-accent-yellow)]",
      "pt-12",
      "pb-4",
    );
  });

  it("applies custom className", () => {
    render(
      <Section className="custom-class" data-testid="section">
        Body
      </Section>,
    );

    expect(screen.getByTestId("section")).toHaveClass("custom-class");
  });
});
