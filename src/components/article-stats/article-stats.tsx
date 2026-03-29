import { format, isValid, parseISO } from "date-fns";
import Link from "next/link";
import type { FC } from "react";
import { Button } from "@/components/button";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface ArticleStatsProps
  extends ComponentPropsWithoutChildren<"div"> {
  categories?: string[];
  publishedAt?: string;
  readTime?: number;
}

const formatDateTime = (value: string | undefined): string | null => {
  if (!value) {
    return null;
  }

  const date = parseISO(value);
  if (!isValid(date)) {
    return null;
  }

  return format(date, "MMM d, yyyy h:mm a");
};

export const ArticleStats: FC<ArticleStatsProps> = ({
  categories,
  publishedAt,
  readTime,
  className,
  ...props
}) => {
  const normalizedCategories = (categories ?? []).filter(
    (value) => value.trim().length > 0,
  );
  const publishedLabel = formatDateTime(publishedAt);
  const readTimeLabel =
    typeof readTime === "number" && Number.isFinite(readTime)
      ? `${Math.max(1, Math.trunc(readTime))} min read`
      : null;

  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <p className="text-sm font-bold">
          By{" "}
          <Link href="/about" className="underline hover:no-underline">
            Jim Drury
          </Link>
        </p>
        {publishedLabel && (
          <p className="text-sm font-bold">
            Published: <span className="font-medium">{publishedLabel}</span>
          </p>
        )}
        {readTimeLabel && <p className="text-sm font-bold">{readTimeLabel}</p>}
      </div>
      {normalizedCategories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {normalizedCategories.map((category) => (
            <Button key={category} asChild variant="secondary" size="small">
              <Link href={`/blog/${category}`}>{category}</Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
