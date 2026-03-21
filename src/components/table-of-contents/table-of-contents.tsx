import type { FC } from "react";
import { Link } from "@/components/link";
import { Typography } from "@/components/typography";
import { getCurrentStory } from "@/lib/current-story-context";
import { getTableOfContentsHeadings } from "@/lib/storyblok-table-of-contents";

export const TableOfContents: FC = () => {
  const story = getCurrentStory();
  const headings = getTableOfContentsHeadings(story);

  if (headings.length === 0) {
    return null;
  }

  return (
    <section>
      <Typography as="h2" size="lg" weight="bold" className="mb-3">
        On this page
      </Typography>
      <nav aria-label="Table of contents">
        <ul className="space-y-1">
          {headings.map((heading) => (
            <li key={heading.id}>
              <Link
                href={`#${heading.id}`}
                className={heading.level === "h3" ? "pl-4" : undefined}
              >
                {heading.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
};
