import NextImage from "next/image";
import type { FC, ReactNode } from "react";

import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

/** Horizontal max width + gutters; keep in sync with content regions (e.g. content band). */
export const HERO_CONTENT_INNER_CLASS =
  "mx-auto w-full max-w-[1400px] px-5 lg:px-12";

export interface HeroProps
  extends Omit<ComponentPropsWithoutChildren<"section">, "title"> {
  badge?: ReactNode;
  title: ReactNode;
  blurb: ReactNode;
  portraitSrc: string;
  portraitAlt: string;
  portraitWidth: number;
  portraitHeight: number;
  /** CSS `object-position` when cropping with `object-cover` (non-CDN assets with focal data). */
  portraitObjectPosition?: string;
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
  className,
  ...props
}) => {
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
          "flex flex-col-reverse gap-6 py-10 lg:flex-row lg:items-start lg:gap-[60px] lg:py-20",
          HERO_CONTENT_INNER_CLASS,
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-5 lg:gap-6">
          {badge ? <div className="flex flex-wrap">{badge}</div> : null}
          <div className="text-balance">{title}</div>
          <div
            className={cn(
              "max-w-[600px] font-[family-name:var(--font-inter)] text-[15px] font-normal leading-[1.6] text-[var(--fg-secondary)] lg:max-w-none lg:text-lg",
              "text-pretty richtext-external-link-indicator [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2 [&_p]:m-0 [&_p+p]:mt-3",
            )}
          >
            {blurb}
          </div>
        </div>
        <div className="w-full shrink-0 lg:w-[480px]">
          <div className="overflow-hidden rounded-xl border-[3px] border-[var(--fg-primary)] shadow-[6px_6px_0_0_var(--fg-primary)] lg:shadow-[8px_8px_0_0_var(--fg-primary)]">
            <NextImage
              src={portraitSrc}
              alt={portraitAlt}
              width={portraitWidth}
              height={portraitHeight}
              sizes="(min-width: 1024px) 480px, 100vw"
              className="h-[300px] w-full object-cover lg:h-[352px]"
              style={
                portraitObjectPosition
                  ? { objectPosition: portraitObjectPosition }
                  : undefined
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
};
