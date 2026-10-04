import NextImage from "next/image";
import type { FC, ReactNode } from "react";

import { RuleMarks } from "@/components/rule-box";
import { Spine } from "@/components/spine";
import { WindowFrame } from "@/components/window-frame";
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
            ? "gap-5 pt-6 pb-8 lg:gap-10 lg:py-8"
            : "gap-6 pt-10 pb-14 lg:gap-[60px] lg:py-16",
          HERO_CONTENT_INNER_CLASS,
        )}
      >
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col",
            isCompact ? "gap-3 lg:gap-4" : "gap-5 lg:gap-6",
            isCompact
              ? "[&_h1]:text-[length:var(--text-6xl)] [&_h1]:leading-[0.9] [&_h1]:tracking-[-0.03em]"
              : "[&_h1]:text-[length:var(--text-8xl)] [&_h1]:leading-[0.9] [&_h1]:tracking-[-0.03em]",
          )}
        >
          {badge ? <div className="flex flex-wrap">{badge}</div> : null}
          <div className="relative text-balance">
            <RuleMarks variant="corners" />
            {title}
          </div>
          <Spine label="About" className="max-w-[600px] lg:max-w-none">
            <div
              className={cn(
                "font-[family-name:var(--font-inter)] font-medium leading-[1.25] text-[var(--fg-primary)]",
                isCompact ? "text-[15px] lg:text-base" : "text-[18px]",
                "text-pretty richtext-external-link-indicator [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2 [&_p]:m-0 [&_p+p]:mt-3",
              )}
            >
              {blurb}
            </div>
          </Spine>
        </div>
        {portraitSrc ? (
          <div
            className={cn(
              "w-full shrink-0",
              isCompact ? "lg:w-[360px]" : "lg:w-[480px]",
            )}
          >
            <div className="os-desktop relative p-3">
              <RuleMarks variant="corners" />
              <WindowFrame title="portrait.tiff" grow>
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
              </WindowFrame>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};
