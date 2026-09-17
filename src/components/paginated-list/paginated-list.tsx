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
        className="flex items-center justify-center gap-3 pt-10"
      >
        <button
          type="button"
          disabled={!canGoPrev}
          onClick={() => goToPage(currentPage - 1)}
          aria-label="Previous page"
          className={cn(
            "inline-flex size-11 items-center justify-center rounded-lg border-[3px] border-[var(--fg-primary)] font-bold shadow-[4px_4px_0_0_var(--fg-primary)] transition-[background-color,box-shadow] focus-visible:outline-2 focus-visible:outline-transparent focus-visible:outline-offset-2 focus-visible:focus-ring-sm",
            canGoPrev
              ? "cursor-pointer bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] hover:shadow-[2px_2px_0_0_var(--fg-primary)]"
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
              "inline-flex size-11 items-center justify-center rounded-lg border-[3px] border-[var(--fg-primary)] font-[family-name:var(--font-geist-mono)] text-sm font-bold transition-[background-color,box-shadow] focus-visible:outline-2 focus-visible:outline-transparent focus-visible:outline-offset-2 focus-visible:focus-ring-sm",
              pageIndex === currentPage
                ? "bg-[var(--fg-primary)] text-[var(--fg-inverse)] shadow-[4px_4px_0_0_var(--fg-primary)]"
                : "cursor-pointer bg-[var(--bg-primary)] shadow-[4px_4px_0_0_var(--fg-primary)] hover:bg-[var(--bg-secondary)] hover:shadow-[2px_2px_0_0_var(--fg-primary)]",
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
            "inline-flex size-11 items-center justify-center rounded-lg border-[3px] border-[var(--fg-primary)] font-bold shadow-[4px_4px_0_0_var(--fg-primary)] transition-[background-color,box-shadow] focus-visible:outline-2 focus-visible:outline-transparent focus-visible:outline-offset-2 focus-visible:focus-ring-sm",
            canGoNext
              ? "cursor-pointer bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] hover:shadow-[2px_2px_0_0_var(--fg-primary)]"
              : "cursor-not-allowed opacity-40",
          )}
        >
          &rarr;
        </button>
      </nav>
    </div>
  );
};
