import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { Badge } from "@/components/badge";
import { Typography } from "@/components/typography";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface BlogCardCompactProps
  extends ComponentPropsWithoutChildren<"article"> {
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

export const BlogCardCompact: FC<BlogCardCompactProps> = ({
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
  ...props
}) => {
  const titleNode = href ? (
    <Link
      href={href}
      className="focus-visible:focus-ring-sm before:absolute before:inset-0 before:z-10 before:block before:content-['']"
    >
      {title}
      <span className="sr-only"> — read the article</span>
    </Link>
  ) : (
    title
  );

  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-lg border-[3px] border-[var(--fg-primary)] bg-white text-[var(--fg-primary)] shadow-[6px_6px_0_0_var(--fg-primary)]",
        className,
      )}
      {...props}
    >
      {imageSrc ? (
        <div className="relative w-full shrink-0">
          <div className="h-[140px] w-full overflow-hidden bg-zinc-100">
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
              variant="highlight"
              className="absolute bottom-[-10px] left-4 z-10"
            >
              {category}
            </Badge>
          ) : null}
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {imageSrc ? (
          <div className="h-0.5 shrink-0" aria-hidden />
        ) : category ? (
          <Badge variant="highlight" className="w-fit">
            {category}
          </Badge>
        ) : null}
        {date ? (
          <time
            dateTime={dateTime}
            className="font-[family-name:var(--font-inter)] text-[12px] font-bold tracking-[1.5px] text-[var(--fg-secondary)]"
          >
            {date}
          </time>
        ) : null}
        <h3 className="font-[family-name:var(--font-anton)] text-[22px] font-bold leading-[30px] tracking-[0.5px] text-[var(--fg-primary)]">
          {titleNode}
        </h3>
        {excerpt ? (
          <Typography size="sm" asChild>
            <p className="line-clamp-2 text-[var(--fg-secondary)]">{excerpt}</p>
          </Typography>
        ) : null}
      </div>
    </article>
  );
};
