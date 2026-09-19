"use client";

import type { FC, PointerEventHandler, ReactNode } from "react";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";
import {
  TICKER_DRAG_THRESHOLD_PX,
  TICKER_LOOP_DURATION_MS,
  TICKER_RESUME_DELAY_MS,
  tickerCopyCount,
  wrapOffset,
} from "./ticker-motion";

/** Separator accent colours (Pencil Marquee Banner cycle). */
const STAR_COLORS = ["#FFE156", "#FF6B6B", "#7ED957", "#A8D8EA"] as const;

export type TickerItemSlot = {
  id: string;
  node: ReactNode;
};

export interface TickerProps extends ComponentPropsWithoutChildren<"div"> {
  items: TickerItemSlot[];
}

type DragSession = {
  pointerId: number | null;
  startX: number;
  startY: number;
  lastX: number;
  active: boolean;
  didDrag: boolean;
};

const createDragSession = (): DragSession => ({
  pointerId: null,
  startX: 0,
  startY: 0,
  lastX: 0,
  active: false,
  didDrag: false,
});

const writeTrackOffset = (
  track: HTMLDivElement | null,
  offsetRef: { current: number },
  next: number,
) => {
  offsetRef.current = next;
  if (track) {
    track.style.transform = `translate3d(${next}px, 0, 0)`;
  }
};

const clearTrackOffset = (
  track: HTMLDivElement | null,
  offsetRef: { current: number },
) => {
  offsetRef.current = 0;
  track?.style.removeProperty("transform");
};

const renderSequence = (items: TickerItemSlot[], keyPrefix: string) =>
  items.map(({ id, node }, index) => (
    <Fragment key={`${keyPrefix}-${id}`}>
      {node}
      <FaStar
        aria-hidden
        className="h-2.5 w-2.5 shrink-0 lg:h-5 lg:w-5"
        style={{ color: STAR_COLORS[index % STAR_COLORS.length] }}
      />
    </Fragment>
  ));

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const tickerCopyKey = (copyIndex: number): string =>
  `ticker-copy-${String(copyIndex)}`;

/**
 * Horizontal ticker. Animates an infinite marquee with edge fade so words are
 * not clipped mid-glyph. Drag left or right to scrub; auto-scroll resumes
 * after a short pause. Under `prefers-reduced-motion`, shows a wrapping
 * static row with no animation or drag.
 */
export const Ticker: FC<TickerProps> = ({ items, className, ...props }) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const stripWidthRef = useRef(0);
  const resumeTimeoutRef = useRef<number | null>(null);
  const dragRef = useRef<DragSession>(createDragSession());

  const [copyCount, setCopyCount] = useState(2);
  const [stripWidth, setStripWidth] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const scheduleResume = () => {
    if (resumeTimeoutRef.current !== null) {
      window.clearTimeout(resumeTimeoutRef.current);
    }

    resumeTimeoutRef.current = window.setTimeout(() => {
      resumeTimeoutRef.current = null;
      setPaused(false);
    }, TICKER_RESUME_DELAY_MS);
  };

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReduceMotion(media.matches);
    };

    sync();
    media.addEventListener("change", sync);
    return () => {
      media.removeEventListener("change", sync);
    };
  }, []);

  useLayoutEffect(() => {
    if (items.length === 0) {
      return;
    }

    const viewport = viewportRef.current;
    const strip = stripRef.current;
    if (!viewport || !strip) {
      return;
    }

    const measure = () => {
      const nextStripWidth = strip.getBoundingClientRect().width;
      const nextViewportWidth = viewport.getBoundingClientRect().width;
      stripWidthRef.current = nextStripWidth;
      setStripWidth(nextStripWidth);
      setCopyCount(tickerCopyCount(nextViewportWidth, nextStripWidth));
      writeTrackOffset(
        trackRef.current,
        offsetRef,
        wrapOffset(offsetRef.current, nextStripWidth),
      );
    };

    measure();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(strip);
    return () => observer.disconnect();
  }, [items.length]);

  useEffect(() => {
    if (!reduceMotion) {
      return;
    }

    clearTrackOffset(trackRef.current, offsetRef);
    setPaused(false);
    setIsDragging(false);
    dragRef.current = createDragSession();
    if (resumeTimeoutRef.current !== null) {
      window.clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion || paused || stripWidth <= 0) {
      return;
    }

    const track = trackRef.current;
    if (!track) {
      return;
    }

    let frame = 0;
    let lastTime = performance.now();
    const pixelsPerMs = stripWidth / TICKER_LOOP_DURATION_MS;

    const tick = (now: number) => {
      const delta = Math.min(now - lastTime, 64);
      lastTime = now;
      writeTrackOffset(
        track,
        offsetRef,
        wrapOffset(offsetRef.current - pixelsPerMs * delta, stripWidth),
      );
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [paused, reduceMotion, stripWidth]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current !== null) {
        window.clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  if (items.length === 0) {
    return null;
  }

  const stripClass =
    "flex shrink-0 flex-nowrap items-center gap-4 pr-4 lg:gap-12 lg:pr-12";

  const endDrag: PointerEventHandler<HTMLDivElement> = (event) => {
    const drag = dragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId) {
      return;
    }

    if (drag.didDrag) {
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      setIsDragging(false);
      scheduleResume();
    }

    dragRef.current = createDragSession();
  };

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (event) => {
    if (reduceMotion || prefersReducedMotion() || event.button !== 0) {
      return;
    }

    if (resumeTimeoutRef.current !== null) {
      window.clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      active: true,
      didDrag: false,
    };
  };

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (event) => {
    const drag = dragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId) {
      return;
    }

    const totalX = event.clientX - drag.startX;
    const totalY = event.clientY - drag.startY;

    if (!drag.didDrag) {
      if (
        Math.abs(totalX) < TICKER_DRAG_THRESHOLD_PX &&
        Math.abs(totalY) < TICKER_DRAG_THRESHOLD_PX
      ) {
        return;
      }

      if (Math.abs(totalY) >= Math.abs(totalX)) {
        dragRef.current = createDragSession();
        return;
      }

      drag.didDrag = true;
      setPaused(true);
      setIsDragging(true);
      event.currentTarget.setPointerCapture?.(event.pointerId);
      writeTrackOffset(
        trackRef.current,
        offsetRef,
        wrapOffset(offsetRef.current + totalX, stripWidthRef.current),
      );
      drag.lastX = event.clientX;
      return;
    }

    const deltaX = event.clientX - drag.lastX;
    drag.lastX = event.clientX;
    writeTrackOffset(
      trackRef.current,
      offsetRef,
      wrapOffset(offsetRef.current + deltaX, stripWidthRef.current),
    );
  };

  const copies = Array.from({ length: copyCount }, (_, copyIndex) => ({
    key: tickerCopyKey(copyIndex),
    copyIndex,
  }));

  return (
    <div
      ref={viewportRef}
      className={cn(
        "ticker-fade overflow-hidden bg-[var(--fg-primary)] text-[var(--fg-inverse)] motion-reduce:overflow-visible",
        className,
      )}
      {...props}
    >
      <div
        ref={trackRef}
        className={cn(
          "ticker-track flex w-max items-center py-3 lg:py-4 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-4 motion-reduce:gap-y-2 motion-reduce:px-4 motion-reduce:py-3",
          reduceMotion
            ? "cursor-default"
            : isDragging
              ? "cursor-grabbing select-none"
              : "cursor-grab select-none touch-pan-y",
        )}
        onPointerCancel={reduceMotion ? undefined : endDrag}
        onPointerDown={reduceMotion ? undefined : handlePointerDown}
        onPointerMove={reduceMotion ? undefined : handlePointerMove}
        onPointerUp={reduceMotion ? undefined : endDrag}
      >
        {copies.map(({ key, copyIndex }) => (
          <div
            key={key}
            ref={copyIndex === 0 ? stripRef : undefined}
            aria-hidden={copyIndex > 0}
            data-ticker-strip={copyIndex}
            className={cn(stripClass, copyIndex > 0 && "motion-reduce:hidden")}
          >
            {renderSequence(items, key)}
          </div>
        ))}
      </div>
    </div>
  );
};
