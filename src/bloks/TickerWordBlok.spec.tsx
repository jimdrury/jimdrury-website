import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TickerWordBlok } from "./TickerWordBlok";

describe("TickerWordBlok", () => {
  it("uses the regular ticker size by default", () => {
    render(
      <TickerWordBlok
        blok={{
          component: "ticker_word",
          label: "Speaker",
        }}
      />,
    );

    expect(screen.getByText("Speaker")).toHaveClass(
      "text-[28px]",
      "font-normal",
      "lowercase",
    );
  });

  it("uses the home-page bold size when weight is bold", () => {
    render(
      <TickerWordBlok
        blok={{
          component: "ticker_word",
          label: "Creator",
          weight: "bold",
        }}
      />,
    );

    expect(screen.getByText("Creator")).toHaveClass(
      "text-[28px]",
      "font-bold",
      "lg:text-[40px]",
    );
  });

  it("returns null when the label is missing", () => {
    const { container } = render(
      <TickerWordBlok
        blok={{
          component: "ticker_word",
        }}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
