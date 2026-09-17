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
 * A single-line status contained in a bordered, hard-shadow panel aligned to the
 * letter column. Keeps the neo-brutalist chrome (3px border, offset shadow, cream)
 * so a short "currently" line reads as intentional rather than floating text.
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
        "w-full bg-[var(--bg-secondary)] pt-8 pb-4 lg:pt-10 lg:pb-5",
        className,
      )}
      {...props}
    >
      <div className={HERO_CONTENT_INNER_CLASS}>
        <div className="flex w-fit max-w-full flex-col gap-3 rounded-xl border-[3px] border-[var(--fg-primary)] bg-[var(--bg-primary)] px-5 py-4 shadow-[6px_6px_0_0_var(--fg-primary)] sm:flex-row sm:items-center sm:gap-4">
          {badge ? <div className="flex shrink-0">{badge}</div> : null}
          <div className="min-w-0 max-w-[80ch] [&_*]:m-0">{children}</div>
        </div>
      </div>
    </section>
  );
};
