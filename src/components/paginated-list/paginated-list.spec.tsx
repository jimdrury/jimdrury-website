import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PaginatedList } from "./paginated-list";
import { scrollBelowStickyHeader } from "./scroll-below-sticky-header";

vi.mock("./scroll-below-sticky-header", () => ({
  scrollBelowStickyHeader: vi.fn(),
}));

describe("PaginatedList", () => {
  beforeEach(() => {
    vi.mocked(scrollBelowStickyHeader).mockReset();
  });

  it("renders children without pagination when they fit on one page", () => {
    render(
      <PaginatedList pageSize={3}>
        <article>One</article>
        <article>Two</article>
      </PaginatedList>,
    );

    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Pagination" })).toBeNull();
    expect(scrollBelowStickyHeader).not.toHaveBeenCalled();
  });

  it("shows the current page of items and pagination controls", () => {
    render(
      <PaginatedList pageSize={1}>
        <article>One</article>
        <article>Two</article>
      </PaginatedList>,
    );

    expect(screen.getByText("One").parentElement).toHaveClass("contents");
    expect(screen.getByText("Two").parentElement).toHaveClass("hidden");
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("does not scroll on the initial render", () => {
    render(
      <PaginatedList pageSize={1} data-testid="list">
        <article>One</article>
        <article>Two</article>
      </PaginatedList>,
    );

    expect(scrollBelowStickyHeader).not.toHaveBeenCalled();
  });

  it("reveals the next page and scrolls the list below the sticky header", async () => {
    const user = userEvent.setup();
    render(
      <PaginatedList pageSize={1} data-testid="list">
        <article>One</article>
        <article>Two</article>
      </PaginatedList>,
    );

    await user.click(screen.getByRole("button", { name: "Page 2" }));

    expect(screen.getByText("Two").parentElement).toHaveClass("contents");
    expect(screen.getByText("One").parentElement).toHaveClass("hidden");
    expect(scrollBelowStickyHeader).toHaveBeenCalledTimes(1);
    expect(scrollBelowStickyHeader).toHaveBeenCalledWith(
      screen.getByTestId("list"),
    );
  });

  it("scrolls when moving to the previous page", async () => {
    const user = userEvent.setup();
    render(
      <PaginatedList pageSize={1} data-testid="list">
        <article>One</article>
        <article>Two</article>
      </PaginatedList>,
    );

    await user.click(screen.getByRole("button", { name: "Next page" }));
    vi.mocked(scrollBelowStickyHeader).mockClear();
    await user.click(screen.getByRole("button", { name: "Previous page" }));

    expect(screen.getByText("One").parentElement).toHaveClass("contents");
    expect(scrollBelowStickyHeader).toHaveBeenCalledTimes(1);
    expect(scrollBelowStickyHeader).toHaveBeenCalledWith(
      screen.getByTestId("list"),
    );
  });
});
