import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PublicEvent } from "./public-event";

describe("PublicEvent", () => {
  it("renders an allowlisted event link", () => {
    render(
      <PublicEvent
        eventDate="2026-04-01"
        title="Talk"
        description="A talk."
        linkUrl="https://example.com/event"
        linkText="Tickets"
      />,
    );

    expect(screen.getByRole("link", { name: "Tickets" })).toHaveAttribute(
      "href",
      "https://example.com/event",
    );
  });

  it("does not render javascript or protocol-relative CMS hrefs", () => {
    const { rerender } = render(
      <PublicEvent
        eventDate="2026-04-01"
        title="Talk"
        description="A talk."
        linkUrl="javascript:alert(1)"
        linkText="Tickets"
      />,
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();

    rerender(
      <PublicEvent
        eventDate="2026-04-01"
        title="Talk"
        description="A talk."
        linkUrl="//evil.com"
        linkText="Tickets"
      />,
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
