import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Ticker } from "./ticker";
import { TICKER_RESUME_DELAY_MS } from "./ticker-motion";

const items = [
  { id: "a", node: <span>Speaker</span> },
  { id: "b", node: <span>Creator</span> },
];

const createRect = (width: number): DOMRect =>
  ({
    x: 0,
    y: 0,
    top: 0,
    bottom: 40,
    left: 0,
    right: width,
    width,
    height: 40,
    toJSON: () => ({}),
  }) as DOMRect;

class ImmediateResizeObserver {
  private readonly callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(): void {
    this.callback([], this);
  }

  unobserve(): void {}

  disconnect(): void {}
}

describe("Ticker", () => {
  let viewportWidth = 800;
  let stripWidth = 1200;
  let reducedMotion = false;

  beforeEach(() => {
    viewportWidth = 800;
    stripWidth = 1200;
    reducedMotion = false;

    vi.stubGlobal(
      "matchMedia",
      (query: string): MediaQueryList =>
        ({
          matches: query.includes("prefers-reduced-motion: reduce")
            ? reducedMotion
            : false,
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList,
    );
    vi.stubGlobal("ResizeObserver", ImmediateResizeObserver);
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn(() => 1),
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());

    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function mockRect(this: HTMLElement) {
        if (this.dataset.tickerStrip === "0") {
          return createRect(stripWidth);
        }

        if (this.classList.contains("ticker-fade")) {
          return createRect(viewportWidth);
        }

        return createRect(0);
      },
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("renders nothing when there are no items", () => {
    const { container } = render(<Ticker items={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders each item and a duplicated aria-hidden strip for the loop", () => {
    render(<Ticker items={items} />);

    // Visible strip + duplicated strip => each label appears twice.
    expect(screen.getAllByText("Speaker")).toHaveLength(2);
    expect(screen.getAllByText("Creator")).toHaveLength(2);
  });

  it("keeps the edge-fade class used for the desktop-only mask", () => {
    const { container } = render(
      <Ticker items={[{ id: "a", node: <span>Speaker</span> }]} />,
    );

    expect(container.querySelector(".ticker-fade")).not.toBeNull();
    expect(container.querySelector(".ticker-track")).not.toBeNull();
  });

  it("renders enough copies to keep a short strip from leaving a blank gap", () => {
    viewportWidth = 1000;
    stripWidth = 200;

    render(<Ticker items={items} />);

    expect(screen.getAllByText("Speaker")).toHaveLength(6);
    expect(screen.getAllByText("Creator")).toHaveLength(6);
  });

  it("scrubs the track when dragged horizontally and wraps without a gap", () => {
    stripWidth = 200;

    const { container } = render(<Ticker items={items} />);
    const track = container.querySelector(".ticker-track");

    expect(track).not.toBeNull();
    if (!track) {
      return;
    }

    fireEvent.pointerDown(track, {
      pointerId: 1,
      button: 0,
      clientX: 100,
      clientY: 10,
    });
    fireEvent.pointerMove(track, {
      pointerId: 1,
      clientX: 140,
      clientY: 10,
    });

    expect(track).toHaveStyle({ transform: "translate3d(-160px, 0, 0)" });
    expect(track).toHaveClass("cursor-grabbing");
  });

  it("ignores a mostly vertical gesture so page scroll still works", () => {
    stripWidth = 200;

    const { container } = render(<Ticker items={items} />);
    const track = container.querySelector(".ticker-track");

    expect(track).not.toBeNull();
    if (!track) {
      return;
    }

    fireEvent.pointerDown(track, {
      pointerId: 1,
      button: 0,
      clientX: 100,
      clientY: 10,
    });
    fireEvent.pointerMove(track, {
      pointerId: 1,
      clientX: 104,
      clientY: 40,
    });

    expect(track).not.toHaveClass("cursor-grabbing");
    expect((track as HTMLElement).style.transform).not.toBe(
      "translate3d(-160px, 0, 0)",
    );
  });

  it("pauses auto-scroll for three seconds after a drag ends", () => {
    stripWidth = 200;
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const raf = vi.mocked(window.requestAnimationFrame);

    const { container } = render(<Ticker items={items} />);
    const track = container.querySelector(".ticker-track");

    expect(track).not.toBeNull();
    if (!track) {
      return;
    }

    act(() => {
      fireEvent.pointerDown(track, {
        pointerId: 1,
        button: 0,
        clientX: 100,
        clientY: 10,
      });
      fireEvent.pointerMove(track, {
        pointerId: 1,
        clientX: 60,
        clientY: 10,
      });
      fireEvent.pointerUp(track, { pointerId: 1, clientX: 60, clientY: 10 });
    });

    expect(track).toHaveStyle({ transform: "translate3d(-40px, 0, 0)" });
    raf.mockClear();

    act(() => {
      vi.advanceTimersByTime(TICKER_RESUME_DELAY_MS - 1);
    });
    expect(raf).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(raf).toHaveBeenCalled();
  });

  it("does not start a drag with a non-primary pointer button", () => {
    stripWidth = 200;

    const { container } = render(<Ticker items={items} />);
    const track = container.querySelector(".ticker-track");

    expect(track).not.toBeNull();
    if (!track) {
      return;
    }

    fireEvent.pointerDown(track, {
      pointerId: 1,
      button: 1,
      clientX: 100,
      clientY: 10,
    });
    fireEvent.pointerMove(track, {
      pointerId: 1,
      clientX: 140,
      clientY: 10,
    });

    expect(track).not.toHaveClass("cursor-grabbing");
  });

  it("does not attach drag handlers when the user prefers reduced motion", async () => {
    reducedMotion = true;

    const { container } = render(<Ticker items={items} />);
    const track = container.querySelector(".ticker-track");

    expect(track).not.toBeNull();
    if (!track) {
      return;
    }

    await waitFor(() => {
      expect(track).toHaveClass("cursor-default");
    });

    fireEvent.pointerDown(track, {
      pointerId: 1,
      button: 0,
      clientX: 100,
      clientY: 10,
    });
    fireEvent.pointerMove(track, {
      pointerId: 1,
      clientX: 140,
      clientY: 10,
    });

    expect(track).not.toHaveClass("cursor-grabbing");
    expect((track as HTMLElement).style.transform).toBe("");
  });

  it("ignores a pointer move that stays below the drag threshold", () => {
    stripWidth = 200;

    const { container } = render(<Ticker items={items} />);
    const track = container.querySelector(".ticker-track");

    expect(track).not.toBeNull();
    if (!track) {
      return;
    }

    fireEvent.pointerDown(track, {
      pointerId: 1,
      button: 0,
      clientX: 100,
      clientY: 10,
    });
    fireEvent.pointerMove(track, {
      pointerId: 1,
      clientX: 103,
      clientY: 11,
    });

    expect(track).not.toHaveClass("cursor-grabbing");
  });

  it("ignores a pointer up from a different pointer than the active drag", () => {
    stripWidth = 200;

    const { container } = render(<Ticker items={items} />);
    const track = container.querySelector(".ticker-track");

    expect(track).not.toBeNull();
    if (!track) {
      return;
    }

    fireEvent.pointerDown(track, {
      pointerId: 1,
      button: 0,
      clientX: 100,
      clientY: 10,
    });
    fireEvent.pointerUp(track, { pointerId: 2, clientX: 100, clientY: 10 });
    fireEvent.pointerMove(track, {
      pointerId: 1,
      clientX: 60,
      clientY: 10,
    });

    expect(track).toHaveStyle({ transform: "translate3d(-40px, 0, 0)" });
  });

  it("restarts the resume delay when a new drag begins during the pause", () => {
    stripWidth = 200;
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const raf = vi.mocked(window.requestAnimationFrame);

    const { container } = render(<Ticker items={items} />);
    const track = container.querySelector(".ticker-track");

    expect(track).not.toBeNull();
    if (!track) {
      return;
    }

    act(() => {
      fireEvent.pointerDown(track, {
        pointerId: 1,
        button: 0,
        clientX: 100,
        clientY: 10,
      });
      fireEvent.pointerMove(track, {
        pointerId: 1,
        clientX: 60,
        clientY: 10,
      });
      fireEvent.pointerUp(track, { pointerId: 1, clientX: 60, clientY: 10 });
    });

    act(() => {
      vi.advanceTimersByTime(1_000);
    });
    raf.mockClear();

    act(() => {
      fireEvent.pointerDown(track, {
        pointerId: 2,
        button: 0,
        clientX: 60,
        clientY: 10,
      });
      fireEvent.pointerMove(track, {
        pointerId: 2,
        clientX: 20,
        clientY: 10,
      });
      fireEvent.pointerUp(track, { pointerId: 2, clientX: 20, clientY: 10 });
    });

    act(() => {
      vi.advanceTimersByTime(TICKER_RESUME_DELAY_MS - 1);
    });
    expect(raf).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(raf).toHaveBeenCalled();
  });

  it("keeps wrapping while the pointer continues to move after the gesture starts", () => {
    stripWidth = 200;

    const { container } = render(<Ticker items={items} />);
    const track = container.querySelector(".ticker-track");

    expect(track).not.toBeNull();
    if (!track) {
      return;
    }

    fireEvent.pointerDown(track, {
      pointerId: 1,
      button: 0,
      clientX: 100,
      clientY: 10,
    });
    fireEvent.pointerMove(track, {
      pointerId: 1,
      clientX: 70,
      clientY: 10,
    });
    fireEvent.pointerMove(track, {
      pointerId: 1,
      clientX: 30,
      clientY: 12,
    });
    fireEvent.pointerCancel(track, { pointerId: 1, clientX: 30, clientY: 12 });

    expect(track).toHaveStyle({ transform: "translate3d(-70px, 0, 0)" });
    expect(track).not.toHaveClass("cursor-grabbing");
  });
});
