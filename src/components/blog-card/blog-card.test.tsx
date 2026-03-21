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

  it("renders custom children instead of default card content", () => {
    render(<BlogCard title="Post">Custom content</BlogCard>);

    expect(screen.getByText("Custom content")).toBeInTheDocument();
    expect(screen.queryByText("Post")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Read more about/i })).toBeNull();
  });

  it("renders image with fallback alt and default dimensions", () => {
    render(<BlogCard title="With image" imageSrc="/hero.jpg" />);

    const image = screen.getByRole("img", { name: "With image" });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("width", "1600");
    expect(image).toHaveAttribute("height", "1000");
  });

  it("renders image with explicit image props", () => {
    render(
      <BlogCard
        title="With image"
        imageSrc="/hero.jpg"
        imageAlt="Custom alt"
        imageWidth={1200}
        imageHeight={630}
        imageLoading="eager"
        imageFetchPriority="high"
      />,
    );

    const image = screen.getByRole("img", { name: "Custom alt" });
    expect(image).toHaveAttribute("width", "1200");
    expect(image).toHaveAttribute("height", "630");
    expect(image).toHaveAttribute("loading", "eager");
    expect(image).toHaveAttribute("fetchpriority", "high");
  });

  it("renders category as an overlay when image is present", () => {
    render(
      <BlogCard title="With image" imageSrc="/hero.jpg" category="Design" />,
    );

    expect(screen.getByText("Design")).toBeInTheDocument();
  });

  it("does not render category when image is missing", () => {
    render(<BlogCard title="No image" category="Design" />);

    expect(screen.queryByText("Design")).toBeNull();
  });
});
