import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Timeline, TimelineItem } from "./timeline";

describe("Timeline", () => {
  it("renders a list", () => {
    render(
      <Timeline>
        <TimelineItem title="Event">Details</TimelineItem>
      </Timeline>,
    );

    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("renders items with title, date and content", () => {
    render(
      <Timeline>
        <TimelineItem date="Jan 2026" title="Started">
          Kicked off development.
        </TimelineItem>
      </Timeline>,
    );

    expect(screen.getByText("Started")).toBeInTheDocument();
    expect(screen.getByText("Jan 2026")).toBeInTheDocument();
    expect(screen.getByText("Kicked off development.")).toBeInTheDocument();
  });
});
