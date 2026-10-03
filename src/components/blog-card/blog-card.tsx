import Image from "next/image";
import Link from "next/link";
import type { FC, ReactNode } from "react";
import { Button } from "@/components/button";
import { RuleMarks } from "@/components/rule-box";
import { Typography } from "@/components/typography";
import { OsTitleBar, toChromeFilename } from "@/components/window-frame";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export type BlogCardDensity = "default" | "compact";

export interface BlogCardProps
  extends ComponentPropsWithoutChildren<"article"> {
  children?: ReactNode;
  href?: string;
  title: string;
  category?: string;
  excerpt?: string;
  date?: string;
  dateTime?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageLoading?: "eager" | "lazy";
  imageFetchPriority?: "high" | "low" | "auto";
  /** `compact` shrinks the cover, drops the dek, and removes the read-more button. */
  density?: BlogCardDensity;
}

export const BlogCard: FC<BlogCardProps> = ({
  className,
  href,
  title,
  category,
  excerpt,
  date,
  dateTime,
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  imageLoading = "lazy",
  imageFetchPriority = "auto",
  density = "default",
  children,
  ...props
}) => {
  const isCompact = density === "compact";

  return (
    <article
      className={cn(
        "rule-box relative flex h-full flex-col overflow-visible bg-[var(--bg-primary)] text-[var(--fg-primary)]",
        className,
      )}
      data-grow="true"
      {...props}
    >
      <RuleMarks />
      {children ? (
        children
      ) : (
        <>
          <OsTitleBar title={toChromeFilename(category)} />
          {imageSrc ? (
            <div className="relative w-full shrink-0">
              <div
                className={cn(
                  "w-full overflow-hidden bg-zinc-100",
                  isCompact ? "h-[140px]" : "h-[220px]",
                )}
              >
                <Image
                  src={imageSrc}
                  alt={imageAlt ?? title}
                  width={imageWidth ?? 1600}
                  height={imageHeight ?? 1000}
                  loading={imageLoading}
                  fetchPriority={imageFetchPriority}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          ) : null}
          <div
            className={cn(
              "flex flex-1 flex-col",
              isCompact ? "gap-2 p-5" : "gap-3 p-6",
            )}
          >
            {date ? (
              <time
                dateTime={dateTime}
                className="font-[family-name:var(--font-inter)] text-[12px] font-bold tracking-[1.5px] text-[var(--fg-secondary)]"
              >
                {date}
              </time>
            ) : null}
            <h2
              className={cn(
                "font-[family-name:var(--font-geist-sans)] font-medium tracking-[-0.03em] text-[var(--fg-primary)] [overflow-wrap:anywhere]",
                isCompact
                  ? "text-[22px] leading-[1.15]"
                  : "line-clamp-3 text-[clamp(1.25rem,1rem+1vw,1.75rem)] leading-[1.15]",
              )}
            >
              {isCompact && href ? (
                <Link
                  href={href}
                  className="focus-visible:focus-ring-sm before:absolute before:inset-0 before:z-10 before:block before:content-['']"
                >
                  {title}
                  <span className="sr-only"> — read the article</span>
                </Link>
              ) : (
                title
              )}
            </h2>
            {!isCompact && excerpt ? (
              <div className="line-clamp-4 text-pretty">
                <Typography size="sm" asChild>
                  <p className="text-[var(--fg-secondary)]">{excerpt}</p>
                </Typography>
              </div>
            ) : null}
            {!isCompact && href ? (
              <>
                <div className="h-2 shrink-0" aria-hidden />
                <div className="min-h-0 flex-1" aria-hidden />
                <div className="flex shrink-0 justify-end">
                  <Button asChild>
                    <Link href={href}>
                      Read more
                      <span className="sr-only"> about {title}</span>
                    </Link>
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </>
      )}
    </article>
  );
};
