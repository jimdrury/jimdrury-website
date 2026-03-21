import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BlogCard } from "./blog-card";

describe("BlogCard", () => {
  it("renders a read more link when href is provided", () => {
    render(<BlogCard title="Test Post" href="/blog/test" />);

    const link = screen.getByRole("link", {
      name: "Read more about Test Post",
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/blog/test");
    expect(screen.getByText("Test Post")).toBeInTheDocument();
    expect(screen.getByText("Read more")).toBeInTheDocument();
  });

  it("renders date when provided", () => {
    render(
      <BlogCard title="Post" date="April 1, 2025" dateTime="2025-04-01" />,
    );

    const time = screen.getByText("April 1, 2025");
    expect(time).toBeInTheDocument();
    expect(time.closest("time")).toHaveAttribute("datetime", "2025-04-01");
  });

  it("renders excerpt when provided", () => {
    render(<BlogCard title="Post" excerpt="A short summary" />);

    expect(screen.getByText("A short summary")).toBeInTheDocument();
  });

  it("does not render date or excerpt when omitted", () => {
    const { container } = render(<BlogCard title="Post" />);

    expect(container.querySelector("time")).toBeNull();
    expect(container.querySelectorAll("p")).toHaveLength(0);
  });

  it("renders as article when href is omitted", () => {
    render(<BlogCard title="Post" />);

    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <BlogCard title="Post" href="/blog/post" className="custom-class" />,
    );

    expect(screen.getByRole("article")).toHaveClass("custom-class");
  });
});
