import NextImage from "next/image";
import type { FC, ReactNode } from "react";

import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

/** Horizontal max width + gutters; keep in sync with content regions (e.g. content band). */
export const HERO_CONTENT_INNER_CLASS =
  "mx-auto w-full max-w-[1400px] px-5 lg:px-12";

export type HeroDensity = "default" | "compact";

export interface HeroProps
  extends Omit<ComponentPropsWithoutChildren<"section">, "title"> {
  badge?: ReactNode;
  title: ReactNode;
  blurb: ReactNode;
  portraitSrc?: string;
  portraitAlt?: string;
  portraitWidth?: number;
  portraitHeight?: number;
  /** CSS `object-position` when cropping with `object-cover` (non-CDN assets with focal data). */
  portraitObjectPosition?: string;
  density?: HeroDensity;
}

export const Hero: FC<HeroProps> = ({
  badge,
  title,
  blurb,
  portraitSrc,
  portraitAlt,
  portraitWidth,
  portraitHeight,
  portraitObjectPosition,
  density = "default",
  className,
  ...props
}) => {
  const isCompact = density === "compact";

  return (
    <section
      className={cn(
        "w-full bg-[var(--bg-primary)] text-[var(--fg-primary)]",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "flex flex-col-reverse lg:flex-row lg:items-start",
          isCompact
            ? "gap-5 py-6 lg:gap-10 lg:py-8"
            : "gap-6 py-10 lg:gap-[60px] lg:py-20",
          HERO_CONTENT_INNER_CLASS,
        )}
      >
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col",
            isCompact ? "gap-3 lg:gap-4" : "gap-5 lg:gap-6",
            isCompact &&
              "[&_h1]:text-[40px] [&_h1]:leading-[0.95] [&_h1]:tracking-[2px] lg:[&_h1]:text-[64px] lg:[&_h1]:tracking-[3px]",
          )}
        >
          {badge ? <div className="flex flex-wrap">{badge}</div> : null}
          <div className="text-balance">{title}</div>
          <div
            className={cn(
              "max-w-[600px] font-[family-name:var(--font-inter)] font-normal leading-[1.6] text-[var(--fg-secondary)] lg:max-w-none",
              isCompact ? "text-[15px] lg:text-base" : "text-[15px] lg:text-lg",
              "text-pretty richtext-external-link-indicator [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2 [&_p]:m-0 [&_p+p]:mt-3",
            )}
          >
            {blurb}
          </div>
        </div>
        {portraitSrc ? (
          <div
            className={cn(
              "w-full shrink-0",
              isCompact ? "lg:w-[360px]" : "lg:w-[480px]",
            )}
          >
            <div className="overflow-hidden rounded-xl border-[3px] border-[var(--fg-primary)] shadow-[6px_6px_0_0_var(--fg-primary)] lg:shadow-[8px_8px_0_0_var(--fg-primary)]">
              <NextImage
                src={portraitSrc}
                alt={portraitAlt ?? ""}
                width={portraitWidth ?? 480}
                height={portraitHeight ?? 352}
                sizes={
                  isCompact
                    ? "(min-width: 1024px) 360px, 100vw"
                    : "(min-width: 1024px) 480px, 100vw"
                }
                className={cn(
                  "w-full object-cover",
                  isCompact
                    ? "h-[220px] lg:h-[280px]"
                    : "h-[300px] lg:h-[352px]",
                )}
                style={
                  portraitObjectPosition
                    ? { objectPosition: portraitObjectPosition }
                    : undefined
                }
                priority
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};
