import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MermaidDiagram } from "./mermaid-diagram";

const renderMermaid = vi.fn();

vi.mock("mermaid", () => ({
  default: {
    initialize: vi.fn(),
    render: (...args: unknown[]) => renderMermaid(...args),
  },
}));

const SAMPLE_SOURCE = "flowchart LR\n  A[Start] --> B[End]";
const SAMPLE_SVG =
  '<svg width="400" height="200" viewBox="0 0 400 200"><text>Start to End</text></svg>';

describe("MermaidDiagram", () => {
  beforeEach(() => {
    renderMermaid.mockReset();
    renderMermaid.mockResolvedValue({ svg: SAMPLE_SVG });
  });

  it("returns nothing when source is empty", () => {
    const { container } = render(<MermaidDiagram source="   " />);
    expect(container).toBeEmptyDOMElement();
    expect(renderMermaid).not.toHaveBeenCalled();
  });

  it("renders title, caption, accessible name, and source fallback", async () => {
    render(
      <MermaidDiagram
        source={SAMPLE_SOURCE}
        title="Request flow"
        caption="Happy path"
        alt="Flowchart from start to end"
      />,
    );

    expect(screen.getByText("Request flow")).toBeInTheDocument();
    expect(screen.getByText("Happy path")).toBeInTheDocument();
    expect(
      screen.getByRole("figure", { name: "Flowchart from start to end" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/A\[Start] --> B\[End]/)).toHaveClass("sr-only");

    await waitFor(() => {
      expect(screen.getByText("Start to End")).toBeInTheDocument();
    });
  });

  it("strips fenced mermaid source before rendering", async () => {
    render(
      <MermaidDiagram source={"```mermaid\nflowchart LR\n  A --> B\n```"} />,
    );

    await waitFor(() => {
      expect(renderMermaid).toHaveBeenCalled();
    });

    expect(renderMermaid.mock.calls[0]?.[1]).toBe("flowchart LR\n  A --> B");
  });

  it("zooms in, zooms out, and fits from labelled controls", async () => {
    const user = userEvent.setup();
    render(<MermaidDiagram source={SAMPLE_SOURCE} title="Map" />);

    await waitFor(() => {
      expect(screen.getByLabelText("Zoom in")).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText("Zoom in"));
    expect(screen.getByText("125%")).toBeInTheDocument();

    await user.click(screen.getByLabelText("Zoom out"));
    expect(screen.getByText("100%")).toBeInTheDocument();

    await user.click(screen.getByLabelText("Zoom in"));
    await user.click(screen.getByLabelText("Fit diagram to view"));
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("shows the mermaid source when rendering fails", async () => {
    renderMermaid.mockRejectedValueOnce(new Error("Unknown diagram type"));

    render(<MermaidDiagram source="not a diagram" />);

    expect(await screen.findByText("Unknown diagram type")).toBeInTheDocument();
    expect(screen.getAllByText("not a diagram").length).toBeGreaterThan(0);
    expect(screen.queryByLabelText("Zoom in")).not.toBeInTheDocument();
  });
});
