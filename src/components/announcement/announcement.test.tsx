import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Announcement } from "./announcement";

describe("Announcement", () => {
  it("renders text content", () => {
    render(<Announcement>Important update available</Announcement>);

    expect(screen.getByText("Important update available")).toBeInTheDocument();
  });

  it("renders as a link with asChild", () => {
    render(
      <Announcement asChild>
        <a href="/news">Click here</a>
      </Announcement>,
    );

    const link = screen.getByRole("link", { name: /click here/i });
    expect(link).toHaveAttribute("href", "/news");
  });
});
