import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Media } from "./media";

describe("Media", () => {
  it("renders an image with the correct alt text", () => {
    render(
      <Media>
        {/* biome-ignore lint/performance/noImgElement: Unit test fixture uses plain img */}
        <img src="https://placehold.co/600x400" alt="Test media" />
      </Media>,
    );

    const img = screen.getByRole("img", { name: "Test media" });
    expect(img).toHaveAttribute("src", "https://placehold.co/600x400");
  });

  it("renders a caption when provided", () => {
    render(
      <Media caption="Photo credit">
        {/* biome-ignore lint/performance/noImgElement: Unit test fixture uses plain img */}
        <img src="https://placehold.co/600x400" alt="Test" />
      </Media>,
    );

    expect(screen.getByText("Photo credit")).toBeInTheDocument();
  });

  it("does not render a caption when omitted", () => {
    const { container } = render(
      <Media>
        {/* biome-ignore lint/performance/noImgElement: Unit test fixture uses plain img */}
        <img src="https://placehold.co/600x400" alt="Test" />
      </Media>,
    );

    expect(container.querySelector("figcaption")).not.toBeInTheDocument();
  });
});
