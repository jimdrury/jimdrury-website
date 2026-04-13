import Image from "next/image";
import type { FC } from "react";
import { ArticleStats } from "@/components/article-stats";
import { Badge } from "@/components/badge";
import { Typography } from "@/components/typography";

export interface ArticleHeroProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  title: string;
  excerpt?: string;
  categories?: string[];
  publishedAt?: string;
  readTime?: number;
}

export const ArticleHero: FC<ArticleHeroProps> = ({
  src,
  alt,
  width,
  height,
  title,
  excerpt,
  categories,
  publishedAt,
  readTime,
}) => {
  const primaryCategory = categories?.find((value) => value.trim().length > 0);

  return (
    <header className="relative">
      <div className="aspect-[16/9] overflow-hidden lg:aspect-[20/7]">
        <Image
          src={src}
          alt={alt}
          width={width ?? 1920}
          height={height ?? 1080}
          sizes="100vw"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="relative z-10 w-full lg:container lg:mx-auto lg:px-12 2xl:max-w-6xl">
        <div className="border-b-[3px] border-black bg-[#ffe156] px-5 py-6 lg:hidden">
          {primaryCategory ? (
            <Badge variant="tertiary" className="mb-4">
              {primaryCategory}
            </Badge>
          ) : null}
          <div className="text-balance">
            <Typography asChild size="3xl">
              <h1>{title}</h1>
            </Typography>
          </div>
          <ArticleStats
            className="mt-4"
            categories={categories}
            publishedAt={publishedAt}
            readTime={readTime}
          />
        </div>
        <div className="absolute -bottom-32 -left-[3px] z-10 hidden w-full max-w-[860px] rounded-md border-[3px] border-black bg-[var(--bg-accent-yellow)] px-10 py-9 text-black shadow-[8px_8px_0_0_var(--fg-primary)] lg:block xl:-bottom-36">
          {primaryCategory ? (
            <Badge variant="tertiary" className="mb-5">
              {primaryCategory}
            </Badge>
          ) : null}
          <div className="text-balance">
            <Typography asChild size="5xl">
              <h1>{title}</h1>
            </Typography>
          </div>
          {excerpt ? (
            <div className="mt-4 text-balance">
              <Typography asChild size="base">
                <p>{excerpt}</p>
              </Typography>
            </div>
          ) : null}
          <ArticleStats
            className={excerpt ? "mt-5" : "mt-6"}
            categories={categories}
            publishedAt={publishedAt}
            readTime={readTime}
          />
        </div>
      </div>
    </header>
  );
};
