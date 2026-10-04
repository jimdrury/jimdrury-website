import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EdgeMarkers } from "./edge-markers";

describe("EdgeMarkers", () => {
  it("renders both section-edge marks", () => {
    const { container } = render(<EdgeMarkers />);

    expect(container.textContent).toContain("∵ x");
    expect(container.textContent).toContain("x ∵");
  });
});
