import { describe, expect, it } from "vitest";
import { normalizeMermaidSource } from "./normalize-mermaid-source";

describe("normalizeMermaidSource", () => {
  it("trims raw mermaid source", () => {
    expect(normalizeMermaidSource("  flowchart LR\n  A --> B  ")).toBe(
      "flowchart LR\n  A --> B",
    );
  });

  it("strips mermaid markdown fences", () => {
    expect(
      normalizeMermaidSource("```mermaid\nflowchart LR\n  A --> B\n```"),
    ).toBe("flowchart LR\n  A --> B");
  });

  it("strips unlabeled markdown fences", () => {
    expect(
      normalizeMermaidSource("```\nsequenceDiagram\n  A->>B: Hi\n```"),
    ).toBe("sequenceDiagram\n  A->>B: Hi");
  });
});
