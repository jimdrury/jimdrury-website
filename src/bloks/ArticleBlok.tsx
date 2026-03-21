import "server-only";
import {
  type SbBlokData,
  StoryblokServerComponent,
  storyblokEditable,
} from "@storyblok/react/rsc";
import type { FC } from "react";
import { ArticleHero } from "@/components/article-hero";
import { Typography } from "@/components/typography";
import { estimateReadTime } from "@/lib/read-time";
import type { StoryblokAsset } from "@/storyblok/types";

const HERO_WIDTH = 1920;
const HERO_HEIGHT = 1080;

const toHeroSrc = (url: string) => `${url}/m/${HERO_WIDTH}x${HERO_HEIGHT}`;

type ImageBlokData = SbBlokData & {
  image?: StoryblokAsset;
};

type ArticleBlokData = SbBlokData & {
  body?: SbBlokData[];
  featured_image?: ImageBlokData[];
  categories?: string[];
  excerpt?: string;
  published_at?: string;
  updated_at?: string;
  story_name?: string;
};

type ArticleBlokProps = {
  blok: ArticleBlokData;
};

export const ArticleBlok: FC<ArticleBlokProps> = ({ blok }) => {
  const title = blok.story_name;
  const featuredImage = blok.featured_image?.[0]?.image;
  const featuredSrc = featuredImage?.filename;
  const readTime = estimateReadTime(blok.body);
  const normalizedCategories = (blok.categories ?? []).filter(
    (value) => value.trim().length > 0,
  );
  const excerpt = blok.excerpt?.trim();
  const updatedAt = blok.updated_at?.trim();

  return (
    <article
      {...storyblokEditable(blok)}
      itemScope
      itemType="https://schema.org/Article"
    >
      {title && <meta itemProp="headline" content={title} />}
      {excerpt && <meta itemProp="description" content={excerpt} />}
      {featuredSrc && <meta itemProp="image" content={featuredSrc} />}
      {blok.published_at && (
        <meta itemProp="datePublished" content={blok.published_at} />
      )}
      {updatedAt && <meta itemProp="dateModified" content={updatedAt} />}
      {normalizedCategories.length > 0 && (
        <>
          <meta itemProp="keywords" content={normalizedCategories.join(", ")} />
          <meta itemProp="articleSection" content={normalizedCategories[0]} />
        </>
      )}
      <span
        itemProp="author"
        itemScope
        itemType="https://schema.org/Person"
        className="sr-only"
      >
        <span itemProp="name">Jim Drury</span>
      </span>
      <span
        itemProp="publisher"
        itemScope
        itemType="https://schema.org/Person"
        className="sr-only"
      >
        <span itemProp="name">Jim Drury</span>
      </span>
      {title &&
        (featuredSrc ? (
          <ArticleHero
            src={toHeroSrc(featuredSrc)}
            alt={
              featuredImage?.alt ||
              featuredImage?.meta_data?.alt ||
              "Featured image"
            }
            width={HERO_WIDTH}
            height={HERO_HEIGHT}
            title={title}
            categories={blok.categories}
            publishedAt={blok.published_at}
            readTime={readTime}
          />
        ) : (
          <div className="mx-auto max-w-5xl px-4">
            <Typography as="h1" size="3xl" weight="black">
              {title}
            </Typography>
          </div>
        ))}
      <section
        className="mx-auto mt-8 max-w-5xl space-y-4 py-4 px-11"
        itemProp="articleBody"
      >
        {blok.body?.map((nestedBlok) => (
          <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
        ))}
      </section>
    </article>
  );
};
