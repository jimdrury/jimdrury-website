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
      "text-[13px]",
      "font-normal",
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
      "text-[18px]",
      "font-bold",
      "lg:text-[24px]",
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
