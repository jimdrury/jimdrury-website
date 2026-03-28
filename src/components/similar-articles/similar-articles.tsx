import Link from "next/link";
import type { FC } from "react";
import { Typography } from "@/components/typography";
import { cn } from "@/lib/utils";

export type SimilarArticleItem = {
  href: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
  dateTime?: string;
};

export interface SimilarArticlesProps {
  items: SimilarArticleItem[];
  className?: string;
}

export const SimilarArticles: FC<SimilarArticlesProps> = ({
  items,
  className,
}) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className={cn(
        "rounded-md border-2 border-black bg-zinc-100 p-4 shadow-[4px_4px_0_0]",
        className,
      )}
      aria-label="Similar articles"
    >
      <Typography as="h2" size="lg" weight="bold" className="mb-3">
        Similar articles
      </Typography>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.href}>
            <article className="relative rounded-md border-2 border-black bg-white p-3">
              <Typography as="h3" size="md" weight="bold">
                <Link
                  href={item.href}
                  className="underline decoration-2 underline-offset-2 [text-decoration-skip-ink:none] hover:text-zinc-700 before:pointer-events-auto before:absolute before:inset-0 before:z-10 before:block before:content-['']"
                >
                  {item.title}
                </Link>
              </Typography>
              {item.publishedAt ? (
                <time
                  className="mt-1 block text-xs font-semibold uppercase text-zinc-600"
                  dateTime={item.dateTime}
                >
                  {item.publishedAt}
                </time>
              ) : null}
              {item.excerpt ? (
                <Typography as="p" size="sm" weight="normal" className="mt-2">
                  {item.excerpt}
                </Typography>
              ) : null}
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
};
