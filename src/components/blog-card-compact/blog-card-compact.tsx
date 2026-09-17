import Image from "next/image";
import Link from "next/link";
import type { FC, ReactNode } from "react";
import { Badge } from "@/components/badge";
import { Typography } from "@/components/typography";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface BlogCardCompactProps
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
  children,
  ...props
}) => {
  const cover = imageSrc ? (
    <div className="h-[140px] w-full shrink-0 overflow-hidden border-b-[3px] border-[var(--fg-primary)] bg-zinc-100">
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
  ) : null;

  const body = (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center gap-2">
        {category && (
          <Badge variant="highlight" className="shrink-0">
            {category}
          </Badge>
        )}
        {date && (
          <time
            dateTime={dateTime}
            className="font-[family-name:var(--font-inter)] text-[11px] font-bold tracking-[1.2px] text-[var(--fg-secondary)]"
          >
            {date}
          </time>
        )}
      </div>
      <h3 className="font-[family-name:var(--font-anton)] text-[22px] font-bold leading-[1.2] tracking-[0.5px] text-[var(--fg-primary)]">
        {title}
      </h3>
      {excerpt ? (
        <Typography size="sm" asChild>
          <p className="line-clamp-2 text-[var(--fg-secondary)]">{excerpt}</p>
        </Typography>
      ) : null}
    </div>
  );

  const classes = cn(
    "flex flex-col overflow-hidden rounded-lg border-[3px] border-[var(--fg-primary)] bg-[var(--bg-primary)] text-[var(--fg-primary)] shadow-[6px_6px_0_0_var(--fg-primary)] transition-shadow hover:shadow-[4px_4px_0_0_var(--fg-primary)]",
    className,
  );

  if (children) {
    return (
      <article className={classes} {...props}>
        {children}
      </article>
    );
  }

  if (href) {
    return (
      <article className={classes} {...props}>
        <Link href={href} className="flex h-full flex-col">
          {cover}
          {body}
        </Link>
      </article>
    );
  }

  return (
    <article className={classes} {...props}>
      {cover}
      {body}
    </article>
  );
};
