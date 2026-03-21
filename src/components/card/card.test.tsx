import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card, CardBody, CardFooter, CardHeader } from "./card";

describe("Card", () => {
  it("renders as an article element", () => {
    render(<Card>Content</Card>);

    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Card className="custom-class">Content</Card>);

    expect(screen.getByRole("article")).toHaveClass("custom-class");
  });

  it("renders composed card with header, body, and footer", () => {
    render(
      <Card>
        <CardHeader>Header</CardHeader>
        <CardBody>Body</CardBody>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );

    expect(screen.getByRole("article")).toBeInTheDocument();
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("passes through additional props", () => {
    render(<Card data-testid="my-card">Content</Card>);

    expect(screen.getByTestId("my-card")).toBeInTheDocument();
  });
});
