import { render, screen } from "@testing-library/react";
import { FaStar } from "react-icons/fa";
import { describe, expect, it } from "vitest";
import { Icon } from "./icon";

describe("Icon", () => {
  it("renders", () => {
    render(
      <Icon data-testid="component">
        <FaStar />
      </Icon>,
    );

    expect(screen.getByTestId("component")).toBeInTheDocument();
  });
});
