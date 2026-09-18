import { render, screen } from "@testing-library/react";
import type { FC } from "react";
import { describe, expect, it, vi } from "vitest";
import { MermaidBlok } from "./MermaidBlok";

vi.mock("@/components/mermaid-diagram", () => {
  const MermaidDiagram: FC<{
    source: string;
    title?: string;
    caption?: string;
    alt?: string;
  }> = ({ source, title, caption, alt }) => (
    <div data-testid="mermaid-diagram">
      <span>{title}</span>
      <span>{caption}</span>
      <span>{alt}</span>
      <pre>{source}</pre>
    </div>
  );

  return { MermaidDiagram };
});

describe("MermaidBlok", () => {
  it("returns null when source is missing", () => {
    const { container } = render(
      <MermaidBlok
        blok={{
          _uid: "mermaid-1",
          component: "mermaid",
        }}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("maps blok fields onto the mermaid diagram", () => {
    render(
      <MermaidBlok
        blok={{
          _uid: "mermaid-2",
          component: "mermaid",
          source: "flowchart LR\n  A --> B",
          title: "Flow",
          caption: "A then B",
          alt: "A points to B",
        }}
      />,
    );

    expect(screen.getByTestId("mermaid-diagram")).toHaveTextContent("Flow");
    expect(screen.getByTestId("mermaid-diagram")).toHaveTextContent("A then B");
    expect(screen.getByTestId("mermaid-diagram")).toHaveTextContent(
      "A points to B",
    );
    expect(screen.getByTestId("mermaid-diagram")).toHaveTextContent(
      "flowchart LR",
    );
  });
});
