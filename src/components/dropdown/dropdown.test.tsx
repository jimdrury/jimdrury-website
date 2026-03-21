import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "./dropdown";

describe("Dropdown", () => {
  const renderDropdown = () =>
    render(
      <Dropdown>
        <DropdownTrigger>Options</DropdownTrigger>
        <DropdownContent>
          <DropdownItem>Edit</DropdownItem>
          <DropdownItem>Delete</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );

  it("renders trigger button", () => {
    renderDropdown();
    expect(screen.getByRole("button", { name: "Options" })).toBeInTheDocument();
  });

  it("does not show content initially", () => {
    renderDropdown();
    expect(screen.queryByRole("menuitem", { name: "Edit" })).toBeNull();
  });

  it("shows content after clicking trigger", async () => {
    const user = userEvent.setup();
    renderDropdown();
    await user.click(screen.getByRole("button", { name: "Options" }));
    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Delete" }),
    ).toBeInTheDocument();
  });

  it("focuses first menu item when opened", async () => {
    const user = userEvent.setup();
    renderDropdown();
    await user.click(screen.getByRole("button", { name: "Options" }));
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus();
  });

  it("closes after clicking an item and returns focus to trigger", async () => {
    const user = userEvent.setup();
    renderDropdown();
    await user.click(screen.getByRole("button", { name: "Options" }));
    await user.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(screen.queryByRole("menuitem", { name: "Edit" })).toBeNull();
    expect(screen.getByRole("button", { name: "Options" })).toHaveFocus();
  });

  it("closes on Escape and returns focus to trigger", async () => {
    const user = userEvent.setup();
    renderDropdown();
    await user.click(screen.getByRole("button", { name: "Options" }));
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menuitem", { name: "Edit" })).toBeNull();
    expect(screen.getByRole("button", { name: "Options" })).toHaveFocus();
  });

  it("moves roving focus with ArrowDown", async () => {
    const user = userEvent.setup();
    renderDropdown();
    await user.click(screen.getByRole("button", { name: "Options" }));
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();
  });

  it("moves roving focus with ArrowUp", async () => {
    const user = userEvent.setup();
    renderDropdown();
    await user.click(screen.getByRole("button", { name: "Options" }));
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();
  });

  it("activates item with Enter and returns focus to trigger", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(
      <Dropdown>
        <DropdownTrigger>Options</DropdownTrigger>
        <DropdownContent>
          <DropdownItem onClick={onEdit}>Edit</DropdownItem>
          <DropdownItem>Delete</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );
    await user.click(screen.getByRole("button", { name: "Options" }));
    await user.keyboard("{Enter}");
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menuitem", { name: "Edit" })).toBeNull();
    expect(screen.getByRole("button", { name: "Options" })).toHaveFocus();
  });
});
