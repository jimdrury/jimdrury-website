export type ViewportTransform = {
  x: number;
  y: number;
  scale: number;
};

export const MIN_SCALE = 0.25;
export const MAX_SCALE = 8;
export const ZOOM_STEP = 1.25;

export const clampScale = (scale: number): number => {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
};

export const createViewport = (x = 0, y = 0, scale = 1): ViewportTransform => {
  return {
    x,
    y,
    scale: clampScale(scale),
  };
};

export const panViewport = (
  viewport: ViewportTransform,
  dx: number,
  dy: number,
): ViewportTransform => {
  return {
    ...viewport,
    x: viewport.x + dx,
    y: viewport.y + dy,
  };
};

export const zoomViewportAtPoint = (
  viewport: ViewportTransform,
  point: { x: number; y: number },
  nextScale: number,
): ViewportTransform => {
  const scale = clampScale(nextScale);
  if (scale === viewport.scale) {
    return viewport;
  }

  const worldX = (point.x - viewport.x) / viewport.scale;
  const worldY = (point.y - viewport.y) / viewport.scale;

  return {
    scale,
    x: point.x - worldX * scale,
    y: point.y - worldY * scale,
  };
};

export const zoomViewportBy = (
  viewport: ViewportTransform,
  factor: number,
  origin: { x: number; y: number },
): ViewportTransform => {
  return zoomViewportAtPoint(viewport, origin, viewport.scale * factor);
};

export const fitViewport = ({
  contentWidth,
  contentHeight,
  containerWidth,
  containerHeight,
  padding = 24,
}: {
  contentWidth: number;
  contentHeight: number;
  containerWidth: number;
  containerHeight: number;
  padding?: number;
}): ViewportTransform => {
  if (
    contentWidth <= 0 ||
    contentHeight <= 0 ||
    containerWidth <= 0 ||
    containerHeight <= 0
  ) {
    return createViewport();
  }

  const availableWidth = Math.max(containerWidth - padding * 2, 1);
  const availableHeight = Math.max(containerHeight - padding * 2, 1);
  const scale = clampScale(
    Math.min(1, availableWidth / contentWidth, availableHeight / contentHeight),
  );

  return {
    scale,
    x: (containerWidth - contentWidth * scale) / 2,
    y: (containerHeight - contentHeight * scale) / 2,
  };
};

export const viewportToCssTransform = (viewport: ViewportTransform): string => {
  return `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`;
};

export const pointerDistance = (
  a: { x: number; y: number },
  b: { x: number; y: number },
): number => {
  return Math.hypot(a.x - b.x, a.y - b.y);
};

export const pointerMidpoint = (
  a: { x: number; y: number },
  b: { x: number; y: number },
): { x: number; y: number } => {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
};
