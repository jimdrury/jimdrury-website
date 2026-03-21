import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Breadcrumb, BreadcrumbItem } from "./breadcrumb";

describe("Breadcrumb", () => {
  it("renders navigation landmark", () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem active>Current</BreadcrumbItem>
      </Breadcrumb>,
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders links for non-active items with href", () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem active>Current</BreadcrumbItem>
      </Breadcrumb>,
    );

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("renders active item as span without link", () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem active>Current</BreadcrumbItem>
      </Breadcrumb>,
    );

    expect(screen.queryByRole("link", { name: "Current" })).toBeNull();
    expect(screen.getByText("Current")).toBeInTheDocument();
  });

  it("renders home icon link when homeHref is set", () => {
    render(
      <Breadcrumb homeHref="/">
        <BreadcrumbItem href="/cat">Category</BreadcrumbItem>
        <BreadcrumbItem active>Product</BreadcrumbItem>
      </Breadcrumb>,
    );

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Category" })).toBeInTheDocument();
  });
});
