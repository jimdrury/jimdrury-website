import { describe, expect, it } from "vitest";
import { contrastRatio, meetsAaContrast } from "./contrast";

const ink = "#1e1e1e";
const paper = "#fefefe";

describe("palette contrast", () => {
  it("keeps black ink on accent surfaces at WCAG AA", () => {
    expect(contrastRatio(ink, "#f386a1")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(ink, "#d96fbf")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(ink, "#09aea1")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(ink, "#03aa5c")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(ink, "#abbab9")).toBeGreaterThanOrEqual(7);
    expect(meetsAaContrast(ink, paper)).toBe(true);
  });

  it("rejects Tailwind prose slate on teal", () => {
    expect(meetsAaContrast("#364153", "#09aea1")).toBe(false);
    expect(meetsAaContrast("#1e1e1e", "#09aea1")).toBe(true);
  });

  it("rejects pink as a text colour on grey or white", () => {
    expect(meetsAaContrast("#f386a1", "#dedede")).toBe(false);
    expect(meetsAaContrast("#f386a1", paper)).toBe(false);
    expect(meetsAaContrast(paper, "#f386a1", { large: true })).toBe(false);
  });
});
