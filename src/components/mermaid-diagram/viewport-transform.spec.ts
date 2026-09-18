import { describe, expect, it } from "vitest";
import {
  clampScale,
  createViewport,
  fitViewport,
  MAX_SCALE,
  MIN_SCALE,
  panViewport,
  pointerDistance,
  pointerMidpoint,
  viewportToCssTransform,
  zoomViewportAtPoint,
  zoomViewportBy,
} from "./viewport-transform";

describe("viewport-transform", () => {
  it("clamps scale to the supported range", () => {
    expect(clampScale(0.01)).toBe(MIN_SCALE);
    expect(clampScale(99)).toBe(MAX_SCALE);
    expect(clampScale(1.5)).toBe(1.5);
  });

  it("zooms around a point without moving that world point", () => {
    const viewport = createViewport();
    const next = zoomViewportAtPoint(viewport, { x: 100, y: 50 }, 2);

    expect(next.scale).toBe(2);
    expect(next.x).toBe(-100);
    expect(next.y).toBe(-50);
    expect(next.x + 100 * next.scale).toBe(100);
    expect(next.y + 50 * next.scale).toBe(50);
  });

  it("zooms by a factor around an origin", () => {
    const next = zoomViewportBy(createViewport(), 2, { x: 0, y: 0 });
    expect(next.scale).toBe(2);
    expect(next.x).toBe(0);
    expect(next.y).toBe(0);
  });

  it("pans by delta", () => {
    expect(panViewport(createViewport(), 12, -8)).toEqual({
      x: 12,
      y: -8,
      scale: 1,
    });
  });

  it("fits content inside the container with padding", () => {
    const viewport = fitViewport({
      contentWidth: 400,
      contentHeight: 200,
      containerWidth: 200,
      containerHeight: 200,
      padding: 20,
    });

    expect(viewport.scale).toBeCloseTo(0.4);
    expect(viewport.x).toBeCloseTo((200 - 400 * 0.4) / 2);
    expect(viewport.y).toBeCloseTo((200 - 200 * 0.4) / 2);
  });

  it("does not magnify content past its natural size", () => {
    const viewport = fitViewport({
      contentWidth: 120,
      contentHeight: 80,
      containerWidth: 400,
      containerHeight: 400,
      padding: 20,
    });

    expect(viewport.scale).toBe(1);
    expect(viewport.x).toBeCloseTo((400 - 120) / 2);
    expect(viewport.y).toBeCloseTo((400 - 80) / 2);
  });

  it("returns an identity viewport when measurements are missing", () => {
    expect(
      fitViewport({
        contentWidth: 0,
        contentHeight: 100,
        containerWidth: 200,
        containerHeight: 200,
      }),
    ).toEqual(createViewport());
  });

  it("serializes to a CSS transform", () => {
    expect(viewportToCssTransform({ x: 10, y: -4, scale: 1.5 })).toBe(
      "translate(10px, -4px) scale(1.5)",
    );
  });

  it("measures pointer geometry", () => {
    expect(pointerDistance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
    expect(pointerMidpoint({ x: 0, y: 0 }, { x: 10, y: 4 })).toEqual({
      x: 5,
      y: 2,
    });
  });
});
