import type { FC } from "react";
import { ArticleStats } from "@/components/article-stats";
import { HeroImage } from "@/components/hero-image";
import { Typography } from "@/components/typography";

export interface ArticleHeroProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  title: string;
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
  categories,
  publishedAt,
  readTime,
}) => {
  return (
    <header>
      <HeroImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="aspect-[16/9] md:aspect-[20/7] lg:aspect-[24/7]"
      />
      <div className="relative z-10 mx-auto -mt-12 w-full max-w-5xl px-4">
        <div className="border-4 border-black bg-yellow-300 px-6 py-6 text-black shadow-[8px_8px_0_0]">
          <Typography
            as="h1"
            size="3xl"
            weight="black"
            className="text-balance"
          >
            {title}
          </Typography>
          <ArticleStats
            className="mt-4"
            categories={categories}
            publishedAt={publishedAt}
            readTime={readTime}
          />
        </div>
      </div>
    </header>
  );
};
