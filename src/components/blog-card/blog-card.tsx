import Image from "next/image";
import Link from "next/link";
import type { FC, ReactNode } from "react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Typography } from "@/components/typography";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

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
  children,
  ...props
}) => {
  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-lg border-[3px] border-[var(--fg-primary)] bg-[var(--bg-primary)] text-[var(--fg-primary)] shadow-[8px_8px_0_0_var(--fg-primary)]",
        className,
      )}
      {...props}
    >
      {children ? (
        children
      ) : (
        <>
          {imageSrc && (
            <div className="relative w-full shrink-0">
              <div className="h-[220px] w-full overflow-hidden bg-zinc-100">
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
              {category && (
                <Badge
                  variant="highlight"
                  className="absolute bottom-[-10px] left-4 z-10"
                >
                  {category}
                </Badge>
              )}
            </div>
          )}
          <div className="flex flex-1 flex-col gap-3 p-6">
            <div className="h-0.5 shrink-0" aria-hidden />
            {date && (
              <time
                dateTime={dateTime}
                className="font-[family-name:var(--font-inter)] text-[12px] font-bold tracking-[1.5px] text-[var(--fg-secondary)]"
              >
                {date}
              </time>
            )}
            <h2 className="font-[family-name:var(--font-anton)] text-[28px] font-bold leading-[1.15] tracking-[1px] text-[var(--fg-primary)]">
              {title}
            </h2>
            {excerpt ? (
              <div className="line-clamp-3 text-pretty">
                <Typography size="sm" asChild>
                  <p className="text-[var(--fg-secondary)]">{excerpt}</p>
                </Typography>
              </div>
            ) : null}
            {href ? (
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
