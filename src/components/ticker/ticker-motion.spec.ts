import { describe, expect, it } from "vitest";
import { tickerCopyCount, wrapOffset } from "./ticker-motion";

describe("wrapOffset", () => {
  it("returns 0 when the period is not a positive width", () => {
    expect(wrapOffset(-12, 0)).toBe(0);
    expect(wrapOffset(-12, -40)).toBe(0);
  });

  it("keeps a negative offset inside the open-closed period", () => {
    expect(wrapOffset(0, 200)).toBe(0);
    expect(wrapOffset(-40, 200)).toBe(-40);
    expect(wrapOffset(-200, 200)).toBe(0);
    expect(wrapOffset(-220, 200)).toBe(-20);
  });

  it("wraps a positive drag back onto the previous copy", () => {
    expect(wrapOffset(40, 200)).toBe(-160);
    expect(wrapOffset(200, 200)).toBe(0);
    expect(wrapOffset(240, 200)).toBe(-160);
  });
});

describe("tickerCopyCount", () => {
  it("falls back to two copies before a strip width is known", () => {
    expect(tickerCopyCount(1200, 0)).toBe(2);
    expect(tickerCopyCount(1200, -1)).toBe(2);
  });

  it("uses two copies when one strip already fills the viewport", () => {
    expect(tickerCopyCount(800, 1200)).toBe(2);
  });

  it("adds copies until the viewport stays filled after a wrap", () => {
    expect(tickerCopyCount(1000, 200)).toBe(6);
    expect(tickerCopyCount(1000, 400)).toBe(4);
  });
});
