import "server-only";
import { draftMode } from "next/headers";
import type { FC, ReactNode } from "react";
import { ArticleHero } from "@/components/article-hero";
import { ArticleNavigation } from "@/components/article-navigation";
import { ArticleStats } from "@/components/article-stats";
import { SimilarArticles } from "@/components/similar-articles";
import { TableOfContents } from "@/components/table-of-contents";
import { Typography } from "@/components/typography";
import { estimateReadTime } from "@/lib/read-time";
import { getArticleStructuredData } from "@/lib/seo";
import { getSimilarArticleItems } from "@/lib/similar-articles";
import { asBlogStory } from "@/lib/story-render-context";
import { sanitizeStoryblokFocusValue } from "@/storyblok/asset-focus";
import { transformStoryblokImage } from "@/storyblok/image-transform";
import {
  type SbBlokData,
  type StoryRenderProps,
  storyblokEditable,
} from "@/storyblok/lib";
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

type ArticleBlokProps = StoryRenderProps & {
  blok: ArticleBlokData;
};

const renderRail = (
  bloks: SbBlokData[] | undefined,
  fallback: ReactNode,
  { pathname, story }: StoryRenderProps,
): ReactNode => {
  if (!bloks || bloks.length === 0) {
    return fallback;
  }

  return bloks.map((nestedBlok) => (
    <BlokRenderer
      blok={nestedBlok}
      key={nestedBlok._uid}
      pathname={pathname}
      story={story}
    />
  ));
};

export const ArticleBlok: FC<ArticleBlokProps> = async ({
  blok,
  pathname,
  story,
}) => {
  const currentStory = asBlogStory(story);
  const title = blok.story_name ?? currentStory?.name;
  const featuredImage = blok.featured_image?.[0]?.image;
  const featuredSrc = featuredImage?.filename;
  const readTime = estimateReadTime(blok.body);
  const categories = blok.categories ?? currentStory?.tag_list ?? [];
  const normalizedCategories = categories.filter(
    (value) => value.trim().length > 0,
  );
  const excerpt = blok.excerpt?.trim();
  const structured = currentStory
    ? getArticleStructuredData(currentStory)
    : null;
  const publishedAt = structured?.datePublished;
  const updatedAt = structured?.dateModified;
  const description = structured?.description;
  const markExcerptAsDescription = Boolean(
    excerpt && description && excerpt === description,
  );
  const { isEnabled } = await draftMode();
  const version = isEnabled ? "draft" : "published";
  const postContent = blok.post_content;
  const hasPostContent = Boolean(postContent && postContent.length > 0);
  const similarItems =
    !hasPostContent && currentStory
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
      {description ? (
        <meta itemProp="description" content={description} />
      ) : null}
      {updatedAt ? <meta itemProp="dateModified" content={updatedAt} /> : null}
      {structured && structured.keywords.length > 0 ? (
        <meta itemProp="keywords" content={structured.keywords.join(", ")} />
      ) : null}
      {normalizedCategories.length > 0 ? (
        <meta itemProp="articleSection" content={normalizedCategories[0]} />
      ) : null}
      {structured?.canonicalUrl ? (
        <link itemProp="mainEntityOfPage" href={structured.canonicalUrl} />
      ) : null}
      <span
        itemProp="author"
        itemScope
        itemType="https://schema.org/Person"
        className="sr-only"
      >
        <span itemProp="name">{structured?.authorName ?? "Jim Drury"}</span>
        <meta
          itemProp="url"
          content={structured?.authorUrl ?? "https://www.jimdrury.co.uk/about"}
        />
        <meta
          itemProp="jobTitle"
          content={structured?.authorJobTitle ?? "Head of Platform Innovation"}
        />
        {(
          structured?.authorSameAs ?? [
            "https://www.linkedin.com/in/jimdrury",
            "https://x.com/jim_drury",
            "https://github.com/jimdrury",
          ]
        ).map((url) => (
          <link key={url} itemProp="sameAs" href={url} />
        ))}
      </span>
      <span
        itemProp="publisher"
        itemScope
        itemType="https://schema.org/Organization"
        className="sr-only"
      >
        <span itemProp="name">{structured?.publisherName ?? "Jim Drury"}</span>
        <meta
          itemProp="url"
          content={structured?.publisherUrl ?? "https://www.jimdrury.co.uk"}
        />
        <span
          itemProp="logo"
          itemScope
          itemType="https://schema.org/ImageObject"
        >
          <meta
            itemProp="url"
            content={
              structured?.publisherLogoUrl ??
              "https://www.jimdrury.co.uk/logo.png"
            }
          />
        </span>
      </span>
      {title &&
        (featuredSrc ? (
          <ArticleHero
            src={transformStoryblokImage(featuredSrc, {
              width: HERO_WIDTH,
              height: HERO_HEIGHT,
              quality: HERO_QUALITY,
              focus: sanitizeStoryblokFocusValue(featuredImage?.focus),
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
            markExcerptAsDescription={markExcerptAsDescription}
          />
        ) : (
          <div className="container mx-auto px-5 lg:px-12 2xl:max-w-6xl">
            <div className="article-headline">
              <Typography asChild size="3xl">
                <h1 itemProp="headline">{title}</h1>
              </Typography>
            </div>
            {excerpt ? (
              <div className="article-description mt-3 text-balance lg:mt-4">
                <Typography asChild size="base">
                  <p
                    {...(markExcerptAsDescription
                      ? { itemProp: "description" }
                      : {})}
                  >
                    {excerpt}
                  </p>
                </Typography>
              </div>
            ) : null}
            <ArticleStats
              className="mt-4"
              includeDateMicrodata
              publishedAt={publishedAt}
              readTime={readTime}
            />
          </div>
        ))}
      <div className="container mx-auto mt-8 flex flex-col gap-6 px-5 lg:mt-28 lg:flex-row lg:items-start lg:gap-12 lg:pb-12 lg:pt-16 2xl:max-w-6xl xl:px-0">
        <div className="lg:hidden">
          {renderRail(
            blok.pre_content,
            <TableOfContents story={currentStory} />,
            {
              pathname,
              story,
            },
          )}
        </div>
        <section
          className="min-w-0 flex-1 space-y-4 lg:pb-4"
          itemProp="articleBody"
        >
          {blok.body?.map((nestedBlok) => (
            <BlokRenderer
              blok={nestedBlok}
              key={nestedBlok._uid}
              pathname={pathname}
              story={story}
            />
          ))}
        </section>
        <aside className="hidden w-[360px] shrink-0 space-y-8 lg:block lg:self-start">
          {renderRail(
            blok.pre_content,
            <TableOfContents story={currentStory} />,
            {
              pathname,
              story,
            },
          )}
          {renderRail(postContent, <SimilarArticles items={similarItems} />, {
            pathname,
            story,
          })}
        </aside>
      </div>
      <div className="container mx-auto mt-8 px-5 pb-6 lg:hidden lg:px-12 2xl:max-w-6xl">
        {renderRail(postContent, <SimilarArticles items={similarItems} />, {
          pathname,
          story,
        })}
      </div>
      {currentStory ? (
        <ArticleNavigation currentStory={currentStory} version={version} />
      ) : null}
    </article>
  );
};
