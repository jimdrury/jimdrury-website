import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BlogCardCompact } from "./blog-card-compact";

describe("BlogCardCompact", () => {
  it("renders date on its own row when provided", () => {
    render(
      <BlogCardCompact
        title="Post"
        date="April 1, 2025"
        dateTime="2025-04-01"
      />,
    );

    const time = screen.getByText("April 1, 2025");
    expect(time).toBeInTheDocument();
    expect(time.closest("time")).toHaveAttribute("datetime", "2025-04-01");
    expect(time.parentElement).not.toHaveClass("items-center");
  });

  it("renders excerpt when provided", () => {
    render(<BlogCardCompact title="Post" excerpt="A short summary" />);

    expect(screen.getByText("A short summary")).toBeInTheDocument();
  });

  it("does not render date or excerpt when omitted", () => {
    const { container } = render(<BlogCardCompact title="Post" />);

    expect(container.querySelector("time")).toBeNull();
    expect(container.querySelectorAll("p")).toHaveLength(0);
  });

  it("renders category as an overlay when image is present", () => {
    const { container } = render(
      <BlogCardCompact
        title="With image"
        imageSrc="/hero.jpg"
        category="Design"
      />,
    );

    const badge = screen.getByText("Design");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("absolute", "bottom-[-10px]", "left-4");
    expect(container.querySelector("time")).toBeNull();
  });

  it("renders category above the date when image is missing", () => {
    render(
      <BlogCardCompact
        title="No image"
        category="Design"
        date="April 1, 2025"
      />,
    );

    const badge = screen.getByText("Design");
    const date = screen.getByText("April 1, 2025");
    expect(badge).toBeInTheDocument();
    expect(badge).not.toHaveClass("absolute");
    expect(date.compareDocumentPosition(badge)).toBe(
      Node.DOCUMENT_POSITION_PRECEDING,
    );
  });

  it("makes the whole card a single title link", () => {
    render(<BlogCardCompact title="Compact Post" href="/blog/compact" />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "/blog/compact");
    expect(links[0]).toHaveAccessibleName(/Compact Post/);
  });

  it("uses a 30px title line-height", () => {
    render(<BlogCardCompact title="Line height post" />);

    expect(
      screen.getByRole("heading", { name: "Line height post" }),
    ).toHaveClass("leading-[30px]");
  });

  it("clamps the title to two lines and the excerpt to three", () => {
    render(
      <BlogCardCompact
        title="A very long title that should clamp"
        excerpt="A longer excerpt that can wrap across three lines."
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "A very long title that should clamp",
      }),
    ).toHaveClass("line-clamp-2");
    expect(
      screen.getByText("A longer excerpt that can wrap across three lines."),
    ).toHaveClass("line-clamp-3");
  });
});
