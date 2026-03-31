import "server-only";
import { draftMode } from "next/headers";
import type { FC } from "react";
import { ArticleHero } from "@/components/article-hero";
import { ArticleNavigation } from "@/components/article-navigation";
import { SimilarArticles } from "@/components/similar-articles";
import { TableOfContents } from "@/components/table-of-contents";
import { Typography } from "@/components/typography";
import { getCurrentStory } from "@/lib/current-story-context";
import { estimateReadTime } from "@/lib/read-time";
import { getSimilarArticleItems } from "@/lib/similar-articles";
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

export const ArticleBlok: FC<ArticleBlokProps> = async ({ blok }) => {
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
  const { isEnabled } = await draftMode();
  const version = isEnabled ? "draft" : "published";
  const similarItems = currentStory
    ? await getSimilarArticleItems({
        currentStory,
        version,
        count: 3,
      })
    : [];

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
        <meta itemProp="url" content="https://www.jimdrury.co.uk/about" />
        <meta itemProp="jobTitle" content="Head of Platform Innovation" />
        <link itemProp="sameAs" href="https://www.linkedin.com/in/jimdrury" />
        <link itemProp="sameAs" href="https://x.com/jim_drury" />
        <link itemProp="sameAs" href="https://github.com/jimdrury" />
      </span>
      <span
        itemProp="publisher"
        itemScope
        itemType="https://schema.org/Person"
        className="sr-only"
      >
        <span itemProp="name">Jim Drury</span>
        <meta itemProp="url" content="https://www.jimdrury.co.uk/about" />
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
          <div className="container mx-auto px-5 lg:px-12 2xl:max-w-6xl">
            <div className="article-headline">
              <Typography asChild size="3xl">
                <h1>{title}</h1>
              </Typography>
            </div>
            {excerpt ? (
              <div className="article-description mt-3 text-balance lg:mt-4">
                <Typography asChild size="md">
                  <p>{excerpt}</p>
                </Typography>
              </div>
            ) : null}
          </div>
        ))}
      <div className="container mx-auto mt-8 flex flex-col gap-6 px-5 lg:mt-28 lg:flex-row lg:items-start lg:gap-12 lg:pb-12 lg:pt-16 2xl:max-w-6xl xl:px-0">
        <div className="lg:hidden">
          <TableOfContents />
        </div>
        <section
          className="min-w-0 flex-1 space-y-4 lg:pb-4"
          itemProp="articleBody"
        >
          {blok.body?.map((nestedBlok) => (
            <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
          ))}
        </section>
        <aside className="hidden w-[360px] shrink-0 space-y-8 lg:block lg:self-start">
          <TableOfContents />
          <SimilarArticles items={similarItems} />
        </aside>
      </div>
      <div className="container mx-auto px-5 pb-6 lg:hidden lg:px-12 2xl:max-w-6xl">
        <SimilarArticles items={similarItems} />
      </div>
      {currentStory ? (
        <ArticleNavigation currentStory={currentStory} version={version} />
      ) : null}
    </article>
  );
};
