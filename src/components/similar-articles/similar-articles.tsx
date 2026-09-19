import type { FC } from "react";
import { BlogCardCompact } from "@/components/blog-card-compact";
import { Typography } from "@/components/typography";
import type { SimilarArticleItem } from "@/lib/similar-articles";
import { cn } from "@/lib/utils";

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
        "rounded-md border-[3px] border-black bg-[var(--bg-secondary)] p-4 shadow-[4px_4px_0_0_var(--fg-primary)] md:p-6",
        className,
      )}
      aria-label="Similar articles"
    >
      <Typography asChild size="3xl" textTransform="uppercase">
        <h2 className="mb-4">Similar Articles</h2>
      </Typography>
      <ul className="space-y-4 md:space-y-8 lg:space-y-10">
        {items.map((item) => (
          <li key={item.href}>
            <BlogCardCompact
              href={item.href}
              title={item.title}
              excerpt={item.excerpt}
              date={item.publishedAt}
              dateTime={item.dateTime}
              imageSrc={item.imageSrc}
              imageAlt={item.imageAlt}
              imageWidth={item.imageWidth}
              imageHeight={item.imageHeight}
              category={item.category}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};
