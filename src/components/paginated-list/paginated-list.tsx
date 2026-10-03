"use client";

import { Children, type FC, type ReactNode, useRef, useState } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";
import { scrollBelowStickyHeader } from "./scroll-below-sticky-header";

export interface PaginatedListProps
  extends ComponentPropsWithoutChildren<"div"> {
  children?: ReactNode;
  pageSize?: number;
}

export const PaginatedList: FC<PaginatedListProps> = ({
  children,
  pageSize = 3,
  className,
  ...props
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);
  const totalPages = Math.ceil(items.length / pageSize);
  const [currentPage, setCurrentPage] = useState(0);

  const goToPage = (pageIndex: number) => {
    setCurrentPage(pageIndex);
    const list = listRef.current;
    if (list) {
      scrollBelowStickyHeader(list);
    }
  };

  if (items.length === 0) {
    return null;
  }

  if (totalPages <= 1) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  return (
    <div className={className} {...props} ref={listRef}>
      {Array.from({ length: totalPages }, (_, i) => i).map((pageIndex) => (
        <div
          key={`page-group-${pageIndex}`}
          className={pageIndex === currentPage ? "contents" : "hidden"}
        >
          {items.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)}
        </div>
      ))}

      <nav
        aria-label="Pagination"
        className="flex items-center justify-center gap-2 pt-10"
      >
        <button
          type="button"
          disabled={!canGoPrev}
          onClick={() => goToPage(currentPage - 1)}
          aria-label="Previous page"
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-none border border-[var(--color-border)] font-medium transition-colors focus-visible:focus-ring-sm",
            canGoPrev
              ? "cursor-pointer bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)]"
              : "cursor-not-allowed opacity-40",
          )}
        >
          &larr;
        </button>

        {Array.from({ length: totalPages }, (_, i) => i).map((pageIndex) => (
          <button
            key={`page-${pageIndex}`}
            type="button"
            onClick={() => goToPage(pageIndex)}
            aria-label={`Page ${pageIndex + 1}`}
            aria-current={pageIndex === currentPage ? "page" : undefined}
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-none border border-[var(--color-border)] font-[family-name:var(--font-mono)] text-sm font-medium transition-colors focus-visible:focus-ring-sm",
              pageIndex === currentPage
                ? "bg-[var(--fg-primary)] text-[var(--fg-inverse)]"
                : "cursor-pointer bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)]",
            )}
          >
            {pageIndex + 1}
          </button>
        ))}

        <button
          type="button"
          disabled={!canGoNext}
          onClick={() => goToPage(currentPage + 1)}
          aria-label="Next page"
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-none border border-[var(--color-border)] font-medium transition-colors focus-visible:focus-ring-sm",
            canGoNext
              ? "cursor-pointer bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)]"
              : "cursor-not-allowed opacity-40",
          )}
        >
          &rarr;
        </button>
      </nav>
    </div>
  );
};
