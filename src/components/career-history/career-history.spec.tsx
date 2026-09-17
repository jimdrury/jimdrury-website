import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CareerHistoryItem } from "./career-history";

const jobTitle = "Engineer";

describe("CareerHistoryItem", () => {
  it("links the company name when the website URL is allowlisted", () => {
    render(
      <CareerHistoryItem
        from="2020-01-01"
        role={jobTitle}
        company="Example"
        companyWebsiteUrl="https://example.com"
        description="Shipped things."
      />,
    );

    expect(screen.getByRole("link", { name: "Example" })).toHaveAttribute(
      "href",
      "https://example.com/",
    );
    expect(screen.getByText(jobTitle)).toBeInTheDocument();
  });

  it("renders the company as text when the website URL is unsafe", () => {
    render(
      <CareerHistoryItem
        from="2020-01-01"
        role={jobTitle}
        company="Example"
        companyWebsiteUrl="javascript:alert(1)"
        description="Shipped things."
      />,
    );

    expect(screen.getByText("Example")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
