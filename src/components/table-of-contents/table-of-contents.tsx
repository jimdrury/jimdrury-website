import type { FC } from "react";
import { FaAngleDoubleDown } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { Link } from "@/components/link";
import { Typography } from "@/components/typography";
import { getCurrentStory } from "@/lib/current-story-context";
import { cn } from "@/lib/utils";
import {
  getTableOfContentsHeadings,
  type TocHeadingLevel,
} from "@/storyblok/table-of-contents";

export interface TableOfContentsProps {
  maxHeadingLevel?: TocHeadingLevel;
}

const headingDepthOrder: TocHeadingLevel[] = ["h2", "h3", "h4"];

const indentByLevel: Record<TocHeadingLevel, string | undefined> = {
  h2: undefined,
  h3: "pl-6",
  h4: "pl-10",
};

export const TableOfContents: FC<TableOfContentsProps> = ({
  maxHeadingLevel = "h3",
}) => {
  const story = getCurrentStory();
  const allHeadings = getTableOfContentsHeadings(story);

  const maxIndex = headingDepthOrder.indexOf(maxHeadingLevel);
  const allowedLevels = new Set(headingDepthOrder.slice(0, maxIndex + 1));
  const headings = allHeadings.filter((h) => allowedLevels.has(h.level));

  if (headings.length === 0) {
    return null;
  }

  return (
    <section className="rounded-md border-[3px] border-black bg-[#f5f0e1] p-4 shadow-[4px_4px_0_0_#1a1a1a] md:p-6">
      <details className="group lg:hidden" open>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
          <Typography asChild size="2xl" uppercase aria-hidden>
            <h2>On This Page</h2>
          </Typography>
          <FiChevronDown
            aria-hidden
            className="shrink-0 text-lg text-zinc-700 transition-transform group-open:rotate-180"
          />
        </summary>
        <nav aria-label="Table of contents" className="mt-4">
          <ul className="space-y-2">
            {headings.map((heading) => (
              <li key={heading.id}>
                <Link
                  href={`#${heading.id}`}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-md border-2 border-black bg-white px-3 py-2 text-sm font-semibold transition-colors hover:bg-yellow-200",
                    indentByLevel[heading.level],
                  )}
                >
                  <span className="truncate underline decoration-2 underline-offset-2 [text-decoration-skip-ink:none]">
                    {heading.text}
                  </span>
                  <FaAngleDoubleDown
                    aria-hidden
                    className="shrink-0 text-xs text-zinc-700"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </details>
      <div className="hidden lg:block">
        <div className="mb-4 flex items-center">
          <Typography asChild size="2xl" uppercase aria-hidden>
            <h2>On This Page</h2>
          </Typography>
        </div>
        <nav aria-label="Table of contents">
          <ul className="space-y-2">
            {headings.map((heading) => (
              <li key={heading.id}>
                <Link
                  href={`#${heading.id}`}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-md border-2 border-black bg-white px-3 py-2 text-sm font-semibold transition-colors hover:bg-yellow-200",
                    indentByLevel[heading.level],
                  )}
                >
                  <span className="truncate underline decoration-2 underline-offset-2 [text-decoration-skip-ink:none]">
                    {heading.text}
                  </span>
                  <FaAngleDoubleDown
                    aria-hidden
                    className="shrink-0 text-xs text-zinc-700"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
};
