import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TabContent, TabList, Tabs, TabTrigger } from "./tab";

describe("Tabs", () => {
  const renderTabs = () =>
    render(
      <Tabs>
        <TabList>
          <TabTrigger index={0}>Tab A</TabTrigger>
          <TabTrigger index={1}>Tab B</TabTrigger>
        </TabList>
        <TabContent index={0}>
          <p>Content A</p>
        </TabContent>
        <TabContent index={1}>
          <p>Content B</p>
        </TabContent>
      </Tabs>,
    );

  it("renders tablist", () => {
    renderTabs();
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("renders tab triggers", () => {
    renderTabs();
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(2);
  });

  it("shows first panel by default", () => {
    renderTabs();
    expect(screen.getByText("Content A")).toBeInTheDocument();
    expect(screen.queryByText("Content B")).toBeNull();
  });

  it("switches panels on tab click", () => {
    renderTabs();
    fireEvent.click(screen.getByRole("tab", { name: "Tab B" }));
    expect(screen.queryByText("Content A")).toBeNull();
    expect(screen.getByText("Content B")).toBeInTheDocument();
  });
});
