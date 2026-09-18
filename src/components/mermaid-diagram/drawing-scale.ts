/**
 * Grow Mermaid's rendered drawing by 25% so 100% zoom is larger.
 * This changes the SVG's intrinsic size rather than the viewport zoom.
 */
export const MERMAID_DRAWING_SCALE = 1.25;

export const parseSvgPixelLength = (
  value: string | null,
): number | undefined => {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim().toLowerCase();
  if (trimmed === "auto" || trimmed.endsWith("%")) {
    return undefined;
  }

  const parsed = Number.parseFloat(trimmed);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
};

type ViewBox = {
  minX: number;
  minY: number;
  width: number;
  height: number;
};

const parseViewBox = (value: string | null): ViewBox | undefined => {
  if (!value) {
    return undefined;
  }

  const parts = value
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isFinite(part))) {
    return undefined;
  }

  const [minX, minY, width, height] = parts;
  if (width <= 0 || height <= 0) {
    return undefined;
  }

  return { minX, minY, width, height };
};

export const measureSvgDisplaySize = (svg: {
  getAttribute: (name: string) => string | null;
}): { width: number; height: number } | undefined => {
  const attrWidth = parseSvgPixelLength(svg.getAttribute("width"));
  const attrHeight = parseSvgPixelLength(svg.getAttribute("height"));
  if (attrWidth && attrHeight) {
    return { width: attrWidth, height: attrHeight };
  }

  const viewBox = parseViewBox(svg.getAttribute("viewBox"));
  if (viewBox) {
    return { width: viewBox.width, height: viewBox.height };
  }

  return undefined;
};

const formatScaledLength = (value: number): string => {
  const scaled = value * MERMAID_DRAWING_SCALE;
  if (Number.isInteger(scaled)) {
    return String(scaled);
  }

  return scaled.toFixed(4).replace(/\.?0+$/, "");
};

const formatViewBox = (viewBox: ViewBox): string => {
  return [
    formatScaledLength(viewBox.minX),
    formatScaledLength(viewBox.minY),
    formatScaledLength(viewBox.width),
    formatScaledLength(viewBox.height),
  ].join(" ");
};

const readNaturalSize = (svg: {
  getAttribute: (name: string) => string | null;
}): { width: number; height: number } | undefined => {
  const viewBox = parseViewBox(svg.getAttribute("viewBox"));
  if (viewBox) {
    return { width: viewBox.width, height: viewBox.height };
  }

  const width = parseSvgPixelLength(svg.getAttribute("width"));
  const height = parseSvgPixelLength(svg.getAttribute("height"));
  if (width && height) {
    return { width, height };
  }

  return undefined;
};

export const enlargeMermaidSvg = (svgMarkup: string): string => {
  if (
    typeof DOMParser === "undefined" ||
    typeof XMLSerializer === "undefined"
  ) {
    return svgMarkup;
  }

  try {
    const doc = new DOMParser().parseFromString(svgMarkup, "image/svg+xml");
    if (doc.querySelector("parsererror")) {
      return svgMarkup;
    }

    const svg = doc.documentElement;
    if (svg.tagName.toLowerCase() !== "svg") {
      return svgMarkup;
    }

    const viewBox = parseViewBox(svg.getAttribute("viewBox"));
    const natural = readNaturalSize(svg);
    if (!natural) {
      return svgMarkup;
    }

    const scaledWidth = formatScaledLength(natural.width);
    const scaledHeight = formatScaledLength(natural.height);
    svg.setAttribute("width", scaledWidth);
    svg.setAttribute("height", scaledHeight);

    if (viewBox) {
      svg.setAttribute("viewBox", formatViewBox(viewBox));
    }

    const style = svg.getAttribute("style");
    if (style?.match(/max-width\s*:/i)) {
      svg.setAttribute(
        "style",
        style.replace(/max-width\s*:\s*[^;]+/gi, `max-width: ${scaledWidth}px`),
      );
    }

    const SVG_NS = "http://www.w3.org/2000/svg";
    const scaler = doc.createElementNS(SVG_NS, "g");
    scaler.setAttribute("transform", `scale(${MERMAID_DRAWING_SCALE})`);
    while (svg.firstChild) {
      scaler.appendChild(svg.firstChild);
    }
    svg.appendChild(scaler);

    return new XMLSerializer().serializeToString(svg);
  } catch {
    return svgMarkup;
  }
};
