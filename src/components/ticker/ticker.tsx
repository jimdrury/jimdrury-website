import type { FC, ReactNode } from "react";
import { Fragment } from "react";
import { FaStar } from "react-icons/fa";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

/** Separator accent colours (Pencil Marquee Banner cycle). */
const STAR_COLORS = ["#FFE156", "#FF6B6B", "#7ED957", "#A8D8EA"] as const;

/** Stable keys for repeated strips at `lg+` (order never changes). */
const LARGE_SCREEN_STRIP_KEYS = [
  "ticker-strip-a",
  "ticker-strip-b",
  "ticker-strip-c",
  "ticker-strip-d",
  "ticker-strip-e",
] as const;

export type TickerItemSlot = {
  id: string;
  node: ReactNode;
};

export interface TickerProps extends ComponentPropsWithoutChildren<"div"> {
  items: TickerItemSlot[];
}

/**
 * Horizontal ticker: one CMS-authored word list; at `lg+` the sequence repeats
 * horizontally (extra strips are `aria-hidden`). No animation.
 */
export const Ticker: FC<TickerProps> = ({ items, className, ...props }) => {
  if (items.length === 0) {
    return null;
  }

  const sequence = items.map(({ id, node }, index) => (
    <Fragment key={id}>
      {node}
      <FaStar
        aria-hidden
        className="h-2.5 w-2.5 shrink-0 lg:h-5 lg:w-5"
        style={{ color: STAR_COLORS[index % STAR_COLORS.length] }}
      />
    </Fragment>
  ));

  const stripClass = "flex shrink-0 flex-nowrap items-center gap-4 lg:gap-12";

  return (
    <div
      className={cn(
        "overflow-hidden bg-[var(--fg-primary)] text-[var(--fg-inverse)]",
        className,
      )}
      {...props}
    >
      <div className="overflow-x-auto px-4 py-3 lg:overflow-x-hidden lg:px-12 lg:py-4">
        <div className="flex w-max flex-nowrap items-center gap-4 lg:w-auto lg:gap-12">
          {LARGE_SCREEN_STRIP_KEYS.map((stripKey, copyIndex) => (
            <div
              key={stripKey}
              aria-hidden={copyIndex > 0 ? true : undefined}
              className={cn(stripClass, copyIndex > 0 && "hidden lg:flex")}
            >
              {sequence}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
