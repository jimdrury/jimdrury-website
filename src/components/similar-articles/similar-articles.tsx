import type { FC } from "react";
import { BlogCardCompact } from "@/components/blog-card-compact";
import { RuleMarks } from "@/components/rule-box";
import { Typography } from "@/components/typography";
import { OsTitleBar } from "@/components/window-frame";
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
        "rule-box relative overflow-visible bg-[var(--bg-primary)]",
        className,
      )}
      aria-label="Similar articles"
    >
      <RuleMarks />
      <OsTitleBar title="similar.articles" />
      <div className="p-4 md:p-6">
        <Typography asChild size="2xl">
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
      </div>
    </section>
  );
};
