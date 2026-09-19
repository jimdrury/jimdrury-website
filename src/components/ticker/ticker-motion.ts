/** Duration of one sequence-width loop, matching the previous CSS animation. */
export const TICKER_LOOP_DURATION_MS = 32_000;

/** How long auto-scroll stays paused after a drag gesture ends. */
export const TICKER_RESUME_DELAY_MS = 3_000;

/** Pointer travel before a gesture is treated as a horizontal drag. */
export const TICKER_DRAG_THRESHOLD_PX = 6;

const FALLBACK_COPY_COUNT = 2;

/**
 * Keep a looping translate in `(-period, 0]` so the track can wrap in either
 * direction without exposing a gap.
 */
export const wrapOffset = (offset: number, period: number): number => {
  if (!(period > 0)) {
    return 0;
  }

  const wrapped = offset % period;
  if (wrapped === 0) {
    return 0;
  }

  return wrapped > 0 ? wrapped - period : wrapped;
};

/**
 * Enough identical strips that the viewport stays filled at every wrap point.
 * One extra copy covers the moment the leading strip has scrolled out of view.
 */
export const tickerCopyCount = (
  viewportWidth: number,
  stripWidth: number,
): number => {
  if (!(stripWidth > 0)) {
    return FALLBACK_COPY_COUNT;
  }

  return Math.max(
    FALLBACK_COPY_COUNT,
    Math.ceil(viewportWidth / stripWidth) + 1,
  );
};
