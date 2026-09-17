import type { FC, ReactNode } from "react";
import { Fragment } from "react";
import { FaStar } from "react-icons/fa";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

/** Separator accent colours (Pencil Marquee Banner cycle). */
const STAR_COLORS = ["#FFE156", "#FF6B6B", "#7ED957", "#A8D8EA"] as const;

export type TickerItemSlot = {
  id: string;
  node: ReactNode;
};

export interface TickerProps extends ComponentPropsWithoutChildren<"div"> {
  items: TickerItemSlot[];
}

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

/**
 * Horizontal ticker. Animates an infinite marquee with edge fade so words are
 * not clipped mid-glyph. Under `prefers-reduced-motion`, shows a wrapping
 * static row with no animation.
 */
export const Ticker: FC<TickerProps> = ({ items, className, ...props }) => {
  if (items.length === 0) {
    return null;
  }

  const stripClass = "flex shrink-0 flex-nowrap items-center gap-4 lg:gap-12";

  return (
    <div
      className={cn(
        "ticker-fade overflow-hidden bg-[var(--fg-primary)] text-[var(--fg-inverse)] motion-reduce:overflow-visible",
        className,
      )}
      {...props}
    >
      <div className="ticker-track flex w-max items-center gap-4 py-3 lg:gap-12 lg:py-4 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-4 motion-reduce:gap-y-2 motion-reduce:px-4 motion-reduce:py-3">
        <div className={stripClass}>{renderSequence(items, "ticker-a")}</div>
        <div aria-hidden className={cn(stripClass, "motion-reduce:hidden")}>
          {renderSequence(items, "ticker-b")}
        </div>
      </div>
    </div>
  );
};
