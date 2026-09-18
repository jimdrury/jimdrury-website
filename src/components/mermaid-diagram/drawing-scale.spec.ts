import { describe, expect, it } from "vitest";
import {
  enlargeMermaidSvg,
  MERMAID_DRAWING_SCALE,
  measureSvgDisplaySize,
  parseSvgPixelLength,
} from "./drawing-scale";

describe("drawing-scale", () => {
  it("parses pixel lengths and ignores percentages", () => {
    expect(parseSvgPixelLength("400")).toBe(400);
    expect(parseSvgPixelLength("156.5px")).toBe(156.5);
    expect(parseSvgPixelLength("100%")).toBeUndefined();
    expect(parseSvgPixelLength("auto")).toBeUndefined();
  });

  it("enlarges mermaid SVG by the drawing scale", () => {
    const enlarged = enlargeMermaidSvg(
      '<svg width="100%" height="auto" viewBox="0 0 400 200" style="max-width: 400px; background: #fff;"><text>Start</text></svg>',
    );

    expect(enlarged).toContain('width="500"');
    expect(enlarged).toContain('height="250"');
    expect(enlarged).toContain('viewBox="0 0 500 250"');
    expect(enlarged).toContain(`scale(${MERMAID_DRAWING_SCALE})`);
    expect(enlarged).toContain("max-width: 500px");
    expect(enlarged).toContain("Start");
    expect(MERMAID_DRAWING_SCALE).toBe(1.25);
  });

  it("measures the scaled display size from pixel attributes first", () => {
    expect(
      measureSvgDisplaySize({
        getAttribute: (name) => {
          switch (name) {
            case "width":
              return "500";
            case "height":
              return "250";
            case "viewBox":
              return "0 0 400 200";
            default:
              return null;
          }
        },
      }),
    ).toEqual({ width: 500, height: 250 });
  });

  it("returns the original markup when the SVG has no measurable size", () => {
    const markup = '<svg width="100%" height="auto"><text>Empty</text></svg>';
    expect(enlargeMermaidSvg(markup)).toBe(markup);
  });
});
