import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DetailsItem, DetailsList } from "./details-list";

describe("DetailsList", () => {
  it("renders a definition list", () => {
    render(
      <DetailsList data-testid="dl">
        <DetailsItem term="Name">Alice</DetailsItem>
      </DetailsList>,
    );

    expect(screen.getByTestId("dl")).toBeInTheDocument();
  });

  it("renders terms and descriptions", () => {
    render(
      <DetailsList>
        <DetailsItem term="Email">alice@example.com</DetailsItem>
        <DetailsItem term="Role">Engineer</DetailsItem>
      </DetailsList>,
    );

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Engineer")).toBeInTheDocument();
  });
});
