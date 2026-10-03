import type { FC } from "react";
import { FiChevronDown } from "react-icons/fi";
import { Link } from "@/components/link";
import { Typography } from "@/components/typography";
import { cn } from "@/lib/utils";
import type { BlogStory } from "@/storyblok/blog-listings-utils";
import {
  getTableOfContentsHeadings,
  type TocHeadingLevel,
} from "@/storyblok/table-of-contents";

export interface TableOfContentsProps {
  maxHeadingLevel?: TocHeadingLevel;
  story: BlogStory | null;
}

const headingDepthOrder: TocHeadingLevel[] = ["h2", "h3", "h4"];

const indentByLevel: Record<TocHeadingLevel, string | undefined> = {
  h2: undefined,
  h3: "pl-6",
  h4: "pl-10",
};

export const TableOfContents: FC<TableOfContentsProps> = ({
  maxHeadingLevel = "h3",
  story,
}) => {
  const allHeadings = getTableOfContentsHeadings(story);

  const maxIndex = headingDepthOrder.indexOf(maxHeadingLevel);
  const allowedLevels = new Set(headingDepthOrder.slice(0, maxIndex + 1));
  const headings = allHeadings.filter((h) => allowedLevels.has(h.level));

  if (headings.length === 0) {
    return null;
  }

  return (
    <section className="rounded-none border border-[var(--color-border)] bg-[var(--bg-primary)] p-4 md:p-6">
      <details className="group lg:hidden" open>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
          <Typography asChild size="3xl" aria-hidden>
            <h2>On This Page</h2>
          </Typography>
          <FiChevronDown
            aria-hidden
            className="shrink-0 text-lg text-[var(--fg-muted)] transition-transform group-open:rotate-180"
          />
        </summary>
        <nav aria-label="Table of contents" className="mt-4">
          <ul className="space-y-2">
            {headings.map((heading) => (
              <li key={heading.id}>
                <Link
                  href={`#${heading.id}`}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-none border border-[var(--color-border)] bg-[var(--bg-primary)] px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--bg-secondary)]",
                    indentByLevel[heading.level],
                  )}
                >
                  <span className="truncate">{heading.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </details>
      <div className="hidden lg:block">
        <Typography asChild size="3xl" aria-hidden>
          <h2 className="mb-4">On This Page</h2>
        </Typography>
        <nav aria-label="Table of contents">
          <ul className="space-y-2">
            {headings.map((heading) => (
              <li key={heading.id}>
                <Link
                  href={`#${heading.id}`}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-none border border-[var(--color-border)] bg-[var(--bg-primary)] px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--bg-secondary)]",
                    indentByLevel[heading.level],
                  )}
                >
                  <span className="truncate">{heading.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
};
