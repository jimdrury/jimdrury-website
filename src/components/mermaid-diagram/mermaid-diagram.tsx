"use client";

import parse from "html-react-parser";
import type { FC, PointerEventHandler, ReactNode } from "react";
import {
  useEffect,
  useEffectEvent,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { LuMinus, LuPlus, LuScan } from "react-icons/lu";
import { Button } from "@/components/button";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";
import { measureSvgDisplaySize } from "./drawing-scale";
import { normalizeMermaidSource } from "./normalize-mermaid-source";
import { getMermaidErrorMessage, renderMermaidSvg } from "./render-mermaid";
import {
  createViewport,
  fitViewport,
  MAX_SCALE,
  MIN_SCALE,
  panViewport,
  pointerDistance,
  pointerMidpoint,
  type ViewportTransform,
  viewportToCssTransform,
  ZOOM_STEP,
  zoomViewportAtPoint,
  zoomViewportBy,
} from "./viewport-transform";

export interface MermaidDiagramProps
  extends ComponentPropsWithoutChildren<"figure"> {
  source: string;
  title?: string;
  caption?: string;
  alt?: string;
}

type DiagramStatus =
  | { type: "loading" }
  | { type: "ready"; svg: string }
  | { type: "error"; message: string };

type PointerPosition = {
  x: number;
  y: number;
};

const measureSvg = (svg: SVGSVGElement): { width: number; height: number } => {
  const display = measureSvgDisplaySize(svg);
  if (display) {
    return display;
  }

  try {
    const bbox = svg.getBBox();
    if (bbox.width > 0 && bbox.height > 0) {
      return { width: bbox.width, height: bbox.height };
    }
  } catch {
    // getBBox throws when the SVG is not rendered.
  }

  return {
    width: svg.clientWidth,
    height: svg.clientHeight,
  };
};

const getContainerOrigin = (
  container: HTMLElement | null,
): { x: number; y: number } => {
  if (!container) {
    return { x: 0, y: 0 };
  }

  const rect = container.getBoundingClientRect();
  return {
    x: rect.width / 2,
    y: rect.height / 2,
  };
};

const getPointInContainer = (
  container: HTMLElement,
  clientX: number,
  clientY: number,
): PointerPosition => {
  const rect = container.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
};

type DiagramControlsProps = {
  scale: number;
  viewportId: string;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
};

const DiagramControls: FC<DiagramControlsProps> = ({
  scale,
  viewportId,
  onZoomIn,
  onZoomOut,
  onFit,
}) => {
  const zoomPercent = Math.round(scale * 100);
  const zoomInDisabled = scale >= MAX_SCALE;
  const zoomOutDisabled = scale <= MIN_SCALE;

  return (
    <div className="absolute right-3 bottom-3 z-10 flex flex-col items-stretch gap-1.5">
      <Button
        type="button"
        size="small"
        variant="highlight"
        className="size-9 p-0"
        aria-label="Zoom in"
        aria-controls={viewportId}
        disabled={zoomInDisabled}
        onClick={onZoomIn}
      >
        <LuPlus aria-hidden className="size-4" />
      </Button>
      <Button
        type="button"
        size="small"
        variant="highlight"
        className="size-9 p-0"
        aria-label="Zoom out"
        aria-controls={viewportId}
        disabled={zoomOutDisabled}
        onClick={onZoomOut}
      >
        <LuMinus aria-hidden className="size-4" />
      </Button>
      <Button
        type="button"
        size="small"
        variant="secondary"
        className="size-9 p-0"
        aria-label="Fit diagram to view"
        aria-controls={viewportId}
        onClick={onFit}
      >
        <LuScan aria-hidden className="size-4" />
      </Button>
      <p
        aria-live="polite"
        className="rounded-md border-2 border-black bg-white px-1 py-0.5 text-center font-mono text-[10px] font-bold"
      >
        {zoomPercent}%
      </p>
    </div>
  );
};

export const MermaidDiagram: FC<MermaidDiagramProps> = ({
  source,
  title,
  caption,
  alt,
  className,
  ...props
}) => {
  const reactId = useId();
  const safeId = reactId.replace(/[^a-zA-Z0-9_-]/g, "");
  const viewportId = `mermaid-viewport-${safeId}`;
  const instructionsId = `mermaid-instructions-${safeId}`;
  const captionId = caption ? `mermaid-caption-${safeId}` : undefined;
  const normalizedSource = normalizeMermaidSource(source);
  const accessibleName = alt || title || "Mermaid diagram";

  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pointersRef = useRef(new Map<number, PointerPosition>());
  const lastPointerRef = useRef<PointerPosition | null>(null);
  const pinchDistanceRef = useRef<number | null>(null);
  const userAdjustedRef = useRef(false);
  const renderCountRef = useRef(0);

  const [status, setStatus] = useState<DiagramStatus>({ type: "loading" });
  const [transform, setTransform] = useState<ViewportTransform>(createViewport);
  const [isPanning, setIsPanning] = useState(false);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);

  const fitToView = useEffectEvent((): void => {
    const container = viewportRef.current;
    const svg = contentRef.current?.querySelector("svg");
    if (!container || !svg) {
      setTransform(createViewport());
      setViewportHeight(null);
      return;
    }

    const content = measureSvg(svg);
    const containerWidth = container.getBoundingClientRect().width;
    const padding = 24;

    const availableWidth = Math.max(containerWidth - padding * 2, 1);
    const widthRatio = availableWidth / content.width;
    const naturalHeight =
      content.height * Math.min(widthRatio, 1) + padding * 2;

    const remPx =
      Number.parseFloat(getComputedStyle(document.documentElement).fontSize) ||
      16;
    const maxH = Math.min(window.innerHeight * 0.7, remPx * 40);
    const containerHeight = Math.max(remPx * 12, Math.min(naturalHeight, maxH));

    setViewportHeight(containerHeight);
    setTransform(
      fitViewport({
        contentWidth: content.width,
        contentHeight: content.height,
        containerWidth,
        containerHeight,
      }),
    );
    userAdjustedRef.current = false;
  });

  const zoomBy = useEffectEvent(
    (factor: number, origin?: PointerPosition): void => {
      const zoomOrigin = origin ?? getContainerOrigin(viewportRef.current);
      userAdjustedRef.current = true;
      setTransform((viewport) => zoomViewportBy(viewport, factor, zoomOrigin));
    },
  );

  useEffect(() => {
    if (!normalizedSource) {
      return;
    }

    let cancelled = false;
    renderCountRef.current += 1;
    const renderId = `mermaid-${safeId}-${renderCountRef.current}`;
    setStatus({ type: "loading" });
    setTransform(createViewport());
    setViewportHeight(null);
    userAdjustedRef.current = false;

    const render = async (): Promise<void> => {
      try {
        const svg = await renderMermaidSvg(normalizedSource, renderId);
        if (!cancelled) {
          setStatus({ type: "ready", svg });
        }
      } catch (error) {
        if (!cancelled) {
          setStatus({
            type: "error",
            message: getMermaidErrorMessage(error),
          });
        }
      }
    };

    void render();

    return () => {
      cancelled = true;
    };
  }, [normalizedSource, safeId]);

  const svgMarkup = status.type === "ready" ? status.svg : undefined;

  useLayoutEffect(() => {
    if (!svgMarkup) {
      return;
    }

    fitToView();
  }, [svgMarkup]);

  useEffect(() => {
    const container = viewportRef.current;
    if (!container || !svgMarkup) {
      return;
    }

    const observer = new ResizeObserver(() => {
      if (!userAdjustedRef.current) {
        fitToView();
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [svgMarkup]);

  useEffect(() => {
    const container = viewportRef.current;
    if (!container || !svgMarkup) {
      return;
    }

    const handleWheel = (event: WheelEvent): void => {
      event.preventDefault();
      const origin = getPointInContainer(
        container,
        event.clientX,
        event.clientY,
      );
      const factor = 2 ** (-event.deltaY / 300);
      zoomBy(factor, origin);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [svgMarkup]);

  if (!normalizedSource) {
    return null;
  }

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (event) => {
    if (status.type !== "ready") {
      return;
    }

    const container = event.currentTarget;
    const point = getPointInContainer(container, event.clientX, event.clientY);
    pointersRef.current.set(event.pointerId, point);
    lastPointerRef.current = { x: event.clientX, y: event.clientY };
    container.setPointerCapture(event.pointerId);

    if (pointersRef.current.size === 1) {
      setIsPanning(true);
    }
  };

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (event) => {
    const container = event.currentTarget;
    const pointers = pointersRef.current;
    if (!pointers.has(event.pointerId)) {
      return;
    }

    const point = getPointInContainer(container, event.clientX, event.clientY);
    pointers.set(event.pointerId, point);

    if (pointers.size === 2) {
      const [first, second] = [...pointers.values()];
      if (!first || !second) {
        return;
      }

      const nextDistance = pointerDistance(first, second);
      const previousDistance = pinchDistanceRef.current;
      pinchDistanceRef.current = nextDistance;

      if (previousDistance && previousDistance > 0) {
        userAdjustedRef.current = true;
        setTransform((viewport) =>
          zoomViewportAtPoint(
            viewport,
            pointerMidpoint(first, second),
            viewport.scale * (nextDistance / previousDistance),
          ),
        );
      }

      setIsPanning(false);
      return;
    }

    const last = lastPointerRef.current;
    if (!last || pointers.size !== 1) {
      return;
    }

    const dx = event.clientX - last.x;
    const dy = event.clientY - last.y;
    lastPointerRef.current = { x: event.clientX, y: event.clientY };
    userAdjustedRef.current = true;
    setTransform((viewport) => panViewport(viewport, dx, dy));
  };

  const endPointer = (pointerId: number): void => {
    pointersRef.current.delete(pointerId);
    if (pointersRef.current.size < 2) {
      pinchDistanceRef.current = null;
    }
    if (pointersRef.current.size === 0) {
      lastPointerRef.current = null;
      setIsPanning(false);
    }
  };

  const handlePointerUp: PointerEventHandler<HTMLDivElement> = (event) => {
    endPointer(event.pointerId);
  };

  let viewportContent: ReactNode;
  switch (status.type) {
    case "loading":
      viewportContent = (
        <p className="m-0 px-4 py-8 text-center font-mono text-sm font-semibold text-zinc-600">
          Rendering diagram…
        </p>
      );
      break;
    case "error":
      viewportContent = (
        <div className="space-y-3 p-4">
          <p className="m-0 font-mono text-sm font-bold text-red-700">
            {status.message}
          </p>
          <pre className="overflow-x-auto whitespace-pre-wrap rounded-md border-2 border-black bg-white p-3 font-mono text-xs">
            {normalizedSource}
          </pre>
        </div>
      );
      break;
    case "ready":
      viewportContent = (
        <div
          ref={contentRef}
          className="inline-block origin-top-left will-change-transform [&_svg]:h-auto [&_svg]:max-w-none"
          style={{ transform: viewportToCssTransform(transform) }}
        >
          {parse(status.svg)}
        </div>
      );
      break;
    default: {
      const exhaustive: never = status;
      viewportContent = exhaustive;
    }
  }

  return (
    <figure
      className={cn(
        "overflow-hidden rounded-md border-2 border-black bg-[var(--bg-primary)] shadow-[4px_4px_0_0]",
        className,
      )}
      aria-label={accessibleName}
      {...props}
    >
      {title ? (
        <div className="border-b-2 border-black bg-yellow-300 px-4 py-2 font-mono text-sm font-semibold">
          {title}
        </div>
      ) : null}

      <p id={instructionsId} className="sr-only">
        Scroll or pinch to zoom. Drag to pan. Use the zoom in, zoom out, and fit
        buttons to adjust the view from the keyboard.
      </p>
      <pre className="sr-only">{normalizedSource}</pre>

      <div className="relative">
        <div
          ref={viewportRef}
          id={viewportId}
          aria-busy={status.type === "loading"}
          aria-describedby={
            captionId ? `${instructionsId} ${captionId}` : instructionsId
          }
          className={cn(
            "relative min-h-[12rem] max-h-[min(70svh,40rem)] overflow-hidden touch-none",
            isPanning ? "cursor-grabbing" : "cursor-grab",
          )}
          style={
            viewportHeight != null ? { height: viewportHeight } : undefined
          }
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {viewportContent}
        </div>

        {status.type === "ready" ? (
          <DiagramControls
            scale={transform.scale}
            viewportId={viewportId}
            onZoomIn={() => zoomBy(ZOOM_STEP)}
            onZoomOut={() => zoomBy(1 / ZOOM_STEP)}
            onFit={fitToView}
          />
        ) : null}
      </div>

      {caption ? (
        <figcaption
          id={captionId}
          className="border-t-2 border-black bg-white px-4 py-2 text-sm font-semibold"
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
};
