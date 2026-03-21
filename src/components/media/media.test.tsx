import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Media } from "./media";

describe("Media", () => {
  it("renders an image with the correct alt text", () => {
    render(<Media src="https://placehold.co/600x400" alt="Test image" />);

    const img = screen.getByRole("img", { name: "Test image" });
    expect(img).toHaveAttribute("src", "https://placehold.co/600x400");
  });

  it("renders a caption when provided", () => {
    render(
      <Media
        src="https://placehold.co/600x400"
        alt="Test"
        caption="Photo credit"
      />,
    );

    expect(screen.getByText("Photo credit")).toBeInTheDocument();
  });

  it("does not render a caption when omitted", () => {
    const { container } = render(
      <Media src="https://placehold.co/600x400" alt="Test" />,
    );

    expect(container.querySelector("figcaption")).not.toBeInTheDocument();
  });
});
