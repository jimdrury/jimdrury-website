import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { Badge, type BadgeProps } from "@/components/badge";
import { Typography } from "@/components/typography";
import type { SimilarArticleItem } from "@/lib/similar-articles";
import { cn } from "@/lib/utils";

export interface SimilarArticlesProps {
  items: SimilarArticleItem[];
  className?: string;
}

const badgeVariants: NonNullable<BadgeProps["variant"]>[] = [
  "primary",
  "tertiary",
  "highlight",
];

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
      <Typography asChild size="2xl" textTransform="uppercase">
        <h2 className="mb-4">Similar Articles</h2>
      </Typography>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={item.href}>
            <article className="relative overflow-hidden rounded-md border-[2px] border-black bg-[var(--bg-primary)]">
              {item.imageSrc ? (
                <div className="relative h-[120px] w-full overflow-hidden border-b-[2px] border-black">
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt ?? item.title}
                    width={item.imageWidth ?? 1600}
                    height={item.imageHeight ?? 1000}
                    loading="lazy"
                    sizes="(min-width: 768px) 360px, 100vw"
                    className="h-full w-full object-cover"
                  />
                  {item.category ? (
                    <Badge
                      variant={badgeVariants[index % badgeVariants.length]}
                      className="absolute right-3 top-3 px-3 py-1 text-[10px] tracking-[1px] shadow-[4px_4px_0_0_var(--fg-primary)]"
                    >
                      {item.category}
                    </Badge>
                  ) : null}
                </div>
              ) : null}
              <div className="relative p-4">
                {item.publishedAt ? (
                  <time
                    className="block text-[11px] font-bold uppercase tracking-[1.5px] text-zinc-600"
                    dateTime={item.dateTime}
                  >
                    {item.publishedAt}
                  </time>
                ) : null}
                <Typography asChild size="xl">
                  <h3 className="mt-2">
                    <Link
                      href={item.href}
                      className="underline decoration-2 underline-offset-2 [text-decoration-skip-ink:none] hover:text-zinc-700 before:pointer-events-auto before:absolute before:inset-0 before:z-10 before:block before:content-['']"
                    >
                      {item.title}
                    </Link>
                  </h3>
                </Typography>
                {item.excerpt ? (
                  <div className="mt-2 line-clamp-2">
                    <Typography asChild size="sm">
                      <p>{item.excerpt}</p>
                    </Typography>
                  </div>
                ) : null}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
};
