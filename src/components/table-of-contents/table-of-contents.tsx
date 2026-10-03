import type { FC } from "react";
import { FaAngleDoubleDown } from "react-icons/fa";
import { LuChevronDown } from "react-icons/lu";
import { IconBox } from "@/components/icon-box";
import { Link } from "@/components/link";
import { WindowFrame } from "@/components/window-frame";
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
  h3: "ml-6",
  h4: "ml-10",
};

const TocLink: FC<{
  id: string;
  index: number;
  text: string;
  level: TocHeadingLevel;
}> = ({ id, index, text, level }) => {
  return (
    <Link
      href={`#${id}`}
      className={cn(
        "group relative flex min-h-10 items-start gap-3 border-l border-dashed border-[var(--color-border)] py-2 pr-1 pl-3 text-sm font-medium no-underline hover:border-solid",
        indentByLevel[level],
      )}
    >
      <span className="w-6 shrink-0 font-[family-name:var(--font-pixel),var(--font-mono)] text-[13px] leading-5 text-[var(--fg-primary)]">
        {String(index).padStart(2, "0")}
      </span>
      <span className="min-w-0 flex-1 text-pretty leading-5">{text}</span>
      <IconBox size="sm" className="mt-0.5">
        <FaAngleDoubleDown />
      </IconBox>
    </Link>
  );
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

  const links = (
    <ul className="space-y-1">
      {headings.map((heading, index) => (
        <li key={heading.id}>
          <TocLink
            id={heading.id}
            index={index + 1}
            text={heading.text}
            level={heading.level}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <WindowFrame title="On This Page" variant="app" clip={false}>
      <section className="p-4 md:p-5">
        <details className="group lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
            <h2 className="font-[family-name:var(--font-geist-sans)] text-[length:var(--text-2xl,1.5rem)] font-medium tracking-[-0.03em]">
              On This Page
            </h2>
            <IconBox size="sm">
              <LuChevronDown className="transition-transform group-open:rotate-180" />
            </IconBox>
          </summary>
          <nav aria-label="Table of contents" className="mt-4">
            {links}
          </nav>
        </details>
        <nav aria-label="Table of contents" className="hidden lg:block">
          {links}
        </nav>
      </section>
    </WindowFrame>
  );
};
