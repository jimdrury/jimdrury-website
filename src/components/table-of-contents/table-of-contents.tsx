import type { FC } from "react";
import { FaAngleDoubleDown } from "react-icons/fa";
import { Link } from "@/components/link";
import { Typography } from "@/components/typography";
import { getCurrentStory } from "@/lib/current-story-context";
import { getTableOfContentsHeadings } from "@/lib/storyblok-table-of-contents";
import { cn } from "@/lib/utils";

export const TableOfContents: FC = () => {
  const story = getCurrentStory();
  const headings = getTableOfContentsHeadings(story);

  if (headings.length === 0) {
    return null;
  }

  return (
    <section className="rounded-md border-2 border-black bg-zinc-100 p-4 shadow-[4px_4px_0_0]">
      <Typography as="h2" size="lg" weight="bold" className="mb-3">
        On this page
      </Typography>
      <nav aria-label="Table of contents">
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.id}>
              <Link
                href={`#${heading.id}`}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-md border-2 border-black bg-white px-3 py-2 text-sm font-semibold transition-colors hover:bg-yellow-200",
                  heading.level === "h3" ? "pl-6" : undefined,
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
    </section>
  );
};
