import Image from "next/image";
import type { FC } from "react";
import { ArticleStats } from "@/components/article-stats";
import { Badge } from "@/components/badge";
import { Typography } from "@/components/typography";
import { WindowFrame } from "@/components/window-frame";

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
      <div className="aspect-[16/9] overflow-hidden border-b border-[var(--color-border)] lg:aspect-[20/7]">
        <Image
          src={src}
          alt={alt}
          width={width ?? 1920}
          height={height ?? 1080}
          sizes="100vw"
          className="h-full w-full object-cover"
          loading="eager"
        />
      </div>
      <div className="relative z-10 w-full px-5 lg:container lg:mx-auto lg:px-12 2xl:max-w-6xl">
        <WindowFrame
          title="article.md"
          variant="document"
          clip={false}
          className="relative z-10 -mt-10 w-full bg-[var(--bg-primary)] text-[var(--fg-primary)] lg:absolute lg:-bottom-32 lg:left-0 lg:mt-0 lg:block lg:max-w-[860px] xl:-bottom-36"
        >
          <div className="px-5 py-6 lg:px-10 lg:py-9">
            {primaryCategory ? (
              <Badge variant="magenta" className="mb-4 lg:mb-5">
                {primaryCategory}
              </Badge>
            ) : null}
            <div className="text-balance">
              <Typography asChild size="4xl">
                <h1 className="lg:text-[length:var(--text-5xl)]">{title}</h1>
              </Typography>
            </div>
            {excerpt ? (
              <div className="mt-4 hidden text-balance lg:block">
                <Typography asChild size="base">
                  <p>{excerpt}</p>
                </Typography>
              </div>
            ) : null}
            <ArticleStats
              className={excerpt ? "mt-4 lg:mt-5" : "mt-4 lg:mt-6"}
              categories={categories}
              publishedAt={publishedAt}
              readTime={readTime}
            />
          </div>
        </WindowFrame>
      </div>
    </header>
  );
};
