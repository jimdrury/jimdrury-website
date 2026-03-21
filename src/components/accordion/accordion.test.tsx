import { render, screen } from "@testing-library/react";
import type { IconType } from "react-icons";
import { describe, expect, it } from "vitest";
import { Accordion, AccordionItem } from "./accordion";

const TestIcon: IconType = (props) => (
  <svg data-testid="custom-icon" viewBox="0 0 24 24" {...props} />
);

describe("Accordion", () => {
  it("renders items with titles", () => {
    render(
      <Accordion>
        <AccordionItem title="First item">Content 1</AccordionItem>
        <AccordionItem title="Second item">Content 2</AccordionItem>
      </Accordion>,
    );

    expect(screen.getByText("First item")).toBeInTheDocument();
    expect(screen.getByText("Second item")).toBeInTheDocument();
  });

  it("renders content inside details", () => {
    render(
      <Accordion>
        <AccordionItem title="Item" open>
          <p>Visible content</p>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByText("Visible content")).toBeInTheDocument();
  });

  it("renders optional leading icon before title and keeps chevron indicator", () => {
    const { container } = render(
      <Accordion>
        <AccordionItem title="Item" icon={TestIcon}>
          Body
        </AccordionItem>
      </Accordion>,
    );

    const summary = container.querySelector("summary");
    expect(summary?.querySelectorAll("svg")).toHaveLength(2);

    const leading = screen.getByTestId("custom-icon");
    expect(leading).toHaveClass("size-4", "shrink-0");
    expect(leading).not.toHaveClass("group-open:-rotate-180");

    const title = screen.getByText("Item");
    expect(title.parentElement?.firstElementChild).toBe(leading);
  });

  it("applies grouped container classes when grouped", () => {
    const { container } = render(
      <Accordion grouped data-testid="accordion-root">
        <AccordionItem title="A">One</AccordionItem>
      </Accordion>,
    );

    const root = container.querySelector("[data-testid=accordion-root]");
    expect(root).toHaveClass("divide-y-2", "border-2", "border-black");
    expect(root).not.toHaveClass("space-y-3");
  });
});
