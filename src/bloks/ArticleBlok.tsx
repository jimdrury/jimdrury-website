import "server-only";
import type { FC } from "react";
import { ArticleHero } from "@/components/article-hero";
import { Typography } from "@/components/typography";
import { getCurrentStory } from "@/lib/current-story-context";
import { estimateReadTime } from "@/lib/read-time";
import { cn } from "@/lib/utils";
import { transformStoryblokImage } from "@/storyblok/image-transform";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";
import { BlokRenderer } from "@/storyblok/renderer";
import type { StoryblokAsset } from "@/storyblok/types";

const HERO_WIDTH = 1920;
const HERO_HEIGHT = 1080;
const HERO_QUALITY = 80;

type ImageBlokData = SbBlokData & {
  image?: StoryblokAsset;
};

type ArticleBlokData = SbBlokData & {
  body?: SbBlokData[];
  pre_content?: SbBlokData[];
  post_content?: SbBlokData[];
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
  const currentStory = getCurrentStory();
  const title = blok.story_name ?? currentStory?.name;
  const featuredImage = blok.featured_image?.[0]?.image;
  const featuredSrc = featuredImage?.filename;
  const readTime = estimateReadTime(blok.body);
  const categories = blok.categories ?? currentStory?.tag_list ?? [];
  const normalizedCategories = categories.filter(
    (value) => value.trim().length > 0,
  );
  const publishedAt =
    blok.published_at ??
    currentStory?.first_published_at ??
    currentStory?.published_at ??
    undefined;
  const excerpt = blok.excerpt?.trim();
  const updatedAt = (
    blok.updated_at ??
    currentStory?.published_at ??
    ""
  ).trim();
  const preContentBloks = blok.pre_content ?? [];
  const postContentBloks = blok.post_content ?? [];
  const hasPreColumn = preContentBloks.length > 0;
  const hasPostColumn = postContentBloks.length > 0;
  const hasSidebarContent = hasPreColumn || hasPostColumn;

  return (
    <article
      {...storyblokEditable(blok)}
      itemScope
      itemType="https://schema.org/BlogPosting"
    >
      {title && <meta itemProp="headline" content={title} />}
      {excerpt && <meta itemProp="description" content={excerpt} />}
      {featuredSrc && <meta itemProp="image" content={featuredSrc} />}
      {publishedAt && <meta itemProp="datePublished" content={publishedAt} />}
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
            src={transformStoryblokImage(featuredSrc, {
              width: HERO_WIDTH,
              height: HERO_HEIGHT,
              quality: HERO_QUALITY,
            })}
            alt={
              featuredImage?.alt ||
              featuredImage?.meta_data?.alt ||
              "Featured image"
            }
            width={HERO_WIDTH}
            height={HERO_HEIGHT}
            title={title}
            excerpt={excerpt}
            categories={categories}
            publishedAt={publishedAt}
            readTime={readTime}
          />
        ) : (
          <div className="mx-auto max-w-5xl px-4">
            <Typography as="h1" size="3xl" weight="black">
              {title}
            </Typography>
            {excerpt ? (
              <Typography
                as="p"
                size="lg"
                weight="medium"
                className="mt-3 max-w-3xl text-balance"
              >
                {excerpt}
              </Typography>
            ) : null}
          </div>
        ))}
      <div
        className={cn(
          "mx-auto mt-8 max-w-6xl px-4 gap-y-6 flex flex-col",
          "md:grid md:gap-x-10 md:gap-y-0",
          "md:[grid-template-columns:minmax(0,3fr)_minmax(0,1fr)]",
          "lg:gap-x-12",
          "lg:[grid-template-columns:minmax(0,5fr)_minmax(0,2fr)]",
        )}
      >
        {hasPreColumn ? (
          <div className="space-y-4 md:hidden">
            {preContentBloks.map((nestedBlok) => (
              <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
            ))}
          </div>
        ) : null}
        <section
          className="space-y-4 pb-0 md:col-start-1 md:row-start-1 md:pb-4"
          itemProp="articleBody"
        >
          {blok.body?.map((nestedBlok) => (
            <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
          ))}
        </section>
        {hasPostColumn ? (
          <div className="space-y-4 md:hidden">
            {postContentBloks.map((nestedBlok) => (
              <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
            ))}
          </div>
        ) : null}
        {hasSidebarContent ? (
          <aside className="hidden space-y-8 md:col-start-2 md:row-start-1 md:block md:self-start">
            {hasPreColumn ? (
              <div className="space-y-4">
                {preContentBloks.map((nestedBlok) => (
                  <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
                ))}
              </div>
            ) : null}
            {hasPostColumn ? (
              <div className="space-y-4">
                {postContentBloks.map((nestedBlok) => (
                  <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
                ))}
              </div>
            ) : null}
          </aside>
        ) : null}
      </div>
    </article>
  );
};
