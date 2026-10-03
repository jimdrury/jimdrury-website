import type { FC, ReactNode } from "react";
import { HERO_CONTENT_INNER_CLASS } from "@/components/hero";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface StatusBandProps
  extends Omit<ComponentPropsWithoutChildren<"section">, "title"> {
  /** Optional pill label (e.g. a coral "Now" badge). */
  badge?: ReactNode;
  children: ReactNode;
}

/**
 * A single-line status contained in a hairline panel aligned to the letter
 * column. Pink backdrop echoes TypeSafe's accent strips.
 */
export const StatusBand: FC<StatusBandProps> = ({
  badge,
  children,
  className,
  ...props
}) => {
  return (
    <section
      className={cn(
        "w-full bg-[var(--bg-primary)] pt-8 pb-4 lg:pt-10 lg:pb-5",
        className,
      )}
      {...props}
    >
      <div className={HERO_CONTENT_INNER_CLASS}>
        <div className="flex w-fit max-w-full flex-col gap-3 rounded-none border border-[var(--color-border)] bg-[var(--bg-accent-pink)] px-5 py-4 sm:flex-row sm:items-center sm:gap-4">
          {badge ? <div className="flex shrink-0">{badge}</div> : null}
          <div className="min-w-0 max-w-[80ch] text-[var(--fg-on-accent)] [&_*]:m-0">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};
