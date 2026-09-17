import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Ticker } from "./ticker";

describe("Ticker", () => {
  it("renders nothing when there are no items", () => {
    const { container } = render(<Ticker items={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders each item and a duplicated aria-hidden strip for the loop", () => {
    render(
      <Ticker
        items={[
          { id: "a", node: <span>Speaker</span> },
          { id: "b", node: <span>Creator</span> },
        ]}
      />,
    );

    // Visible strip + duplicated strip => each label appears twice.
    expect(screen.getAllByText("Speaker")).toHaveLength(2);
    expect(screen.getAllByText("Creator")).toHaveLength(2);
  });

  it("applies the edge-fade class so words are not clipped at the container edge", () => {
    const { container } = render(
      <Ticker items={[{ id: "a", node: <span>Speaker</span> }]} />,
    );

    expect(container.querySelector(".ticker-fade")).not.toBeNull();
    expect(container.querySelector(".ticker-track")).not.toBeNull();
  });
});
