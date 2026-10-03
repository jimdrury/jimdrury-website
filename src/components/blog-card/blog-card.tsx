import Image from "next/image";
import Link from "next/link";
import type { FC, ReactNode } from "react";
import { FaAngleDoubleRight } from "react-icons/fa";
import { Badge } from "@/components/badge";
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
  const filename = toChromeFilename(
    href?.split("/").filter(Boolean).at(-1) ?? category,
  );

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
          <OsTitleBar title={filename} />
          {imageSrc ? (
            <div className="relative w-full shrink-0">
              <div
                className={cn(
                  "w-full overflow-hidden border-b border-[var(--color-border-strong)] bg-[var(--bg-secondary)]",
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
              {category ? (
                <Badge
                  variant="magenta"
                  className="absolute bottom-0 left-0 z-[1]"
                >
                  {category}
                </Badge>
              ) : null}
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
                className="font-[family-name:var(--font-mono)] text-[11px] capitalize tracking-[0.05em] text-[var(--fg-secondary)]"
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
                <div className="min-h-0 flex-1" aria-hidden />
                <Link
                  href={href}
                  className="group mt-2 inline-flex items-center gap-2 font-[family-name:var(--font-geist-sans)] text-sm font-medium text-[var(--fg-primary)] no-underline"
                >
                  Read more
                  <span className="sr-only"> about {title}</span>
                  <FaAngleDoubleRight
                    aria-hidden
                    className="size-3 transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </>
            ) : null}
          </div>
        </>
      )}
    </article>
  );
};
