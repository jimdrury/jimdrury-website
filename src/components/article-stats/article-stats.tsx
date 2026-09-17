import { format, isValid, parseISO } from "date-fns";
import type { FC } from "react";
import { Badge } from "@/components/badge";
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

  return format(date, "MMM d, yyyy").toUpperCase();
};

export const ArticleStats: FC<ArticleStatsProps> = ({
  categories,
  publishedAt,
  readTime,
  className,
  ...props
}) => {
  const publishedLabel = formatDateTime(publishedAt);
  const readTimeLabel =
    typeof readTime === "number" && Number.isFinite(readTime)
      ? `${Math.max(1, Math.trunc(readTime))} MIN READ`
      : null;
  const normalizedCategories =
    categories?.filter((value) => value.trim().length > 0) ?? [];

  if (!publishedLabel && !readTimeLabel && normalizedCategories.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-bold uppercase tracking-[1.5px] text-[var(--fg-secondary)] md:text-xs",
        className,
      )}
      {...props}
    >
      {publishedLabel ? <span>{publishedLabel}</span> : null}
      {publishedLabel && readTimeLabel ? (
        <span aria-hidden className="text-[#666]">
          .
        </span>
      ) : null}
      {readTimeLabel ? <span>{readTimeLabel}</span> : null}
      {normalizedCategories.length > 0 && (publishedLabel || readTimeLabel) ? (
        <span aria-hidden className="text-[#666]">
          .
        </span>
      ) : null}
      {normalizedCategories.map((category) => (
        <Badge key={category} variant="dark" className="text-[10px] md:text-[11px] px-3 py-1">
          {category}
        </Badge>
      ))}
    </div>
  );
};
