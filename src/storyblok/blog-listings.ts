import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import {
  BLOG_SCOPES,
  getBlogArticleSlugTag,
  getBlogArticlesByTagIndexTag,
  getBlogArticlesByTagTag,
  getBlogVersionTag,
} from "@/lib/cache-tags";
import { fetchStoryBySlug } from "@/lib/storyblok-story";
import { getStoryblokApi, getStoryblokCv } from "@/storyblok";
import {
  BLOG_ARCHIVE_PAGE_SIZE,
  BLOG_CONTENT_TYPE,
  BLOG_PREFIX,
  type BlogStory,
  getNextUnreleasedReleaseAt,
  getVisibleArticles,
  isArticleReleased,
  isArticleStory,
  type StoryblokStoriesResponse,
} from "@/storyblok/blog-listings-utils";

const BLOG_FETCH_PER_PAGE = 100;
const SIMILAR_ARTICLES_SEED_SIZE = 25;

export type BlogStoriesSnapshot = {
  visibleStories: BlogStory[];
  nextReleaseAt: string | null;
};

const applyPublishedListingCacheLife = (nextReleaseAt: string | null): void => {
  if (!nextReleaseAt) {
    cacheLife("ultraLong");
    return;
  }

  const expire = Math.max(
    2,
    Math.ceil((Date.parse(nextReleaseAt) - Date.now()) / 1000),
  );

  cacheLife({
    stale: Math.min(60, expire - 1),
    revalidate: expire - 1,
    expire,
  });
};

const fetchAllArticleStories = async (
  version: "draft" | "published",
): Promise<BlogStory[]> => {
  const storyblokApi = getStoryblokApi();
  const stories: BlogStory[] = [];
  let page = 1;

  while (true) {
    const response = (await storyblokApi.get("cdn/stories", {
      version,
      cv: getStoryblokCv(),
      starts_with: BLOG_PREFIX,
      content_type: BLOG_CONTENT_TYPE,
      sort_by: "first_published_at:desc",
      page,
      per_page: BLOG_FETCH_PER_PAGE,
    })) as StoryblokStoriesResponse;

    const batch = (response.data?.stories ?? []).filter(isArticleStory);
    stories.push(...batch);

    if (batch.length < BLOG_FETCH_PER_PAGE) {
      break;
    }

    page += 1;
  }

  return stories;
};

export const getBlogStoriesSnapshot = async (
  version: "draft" | "published" = "published",
): Promise<BlogStoriesSnapshot> => {
  "use cache";
  cacheTag(getBlogVersionTag({ scope: BLOG_SCOPES.allArticles, version }));

  const stories = await fetchAllArticleStories(version);
  const now = new Date();
  const nextReleaseAt =
    version === "published" ? getNextUnreleasedReleaseAt(stories, now) : null;

  applyPublishedListingCacheLife(nextReleaseAt?.toISOString() ?? null);

  return {
    visibleStories: getVisibleArticles(stories, version, now),
    nextReleaseAt: nextReleaseAt?.toISOString() ?? null,
  };
};

export const applySnapshotCacheLife = (snapshot: BlogStoriesSnapshot): void => {
  applyPublishedListingCacheLife(snapshot.nextReleaseAt);
};

export const getArticlesByTag = async (
  tag: string,
  index: number,
  version: "draft" | "published" = "published",
): Promise<BlogStory[]> => {
  "use cache";
  const normalizedTag = tag.trim();
  if (!normalizedTag) {
    return [];
  }

  const pageIndex = Number.isFinite(index) ? Math.max(0, Math.trunc(index)) : 0;
  const cacheTagValue = getBlogArticlesByTagIndexTag({
    tag: normalizedTag,
    index: pageIndex,
    version,
  });

  const blogVersionTag = getBlogVersionTag({
    scope: BLOG_SCOPES.articlesByTag,
    version,
  });

  cacheTag(blogVersionTag);
  cacheTag(getBlogArticlesByTagTag({ tag: normalizedTag, version }));
  cacheTag(cacheTagValue);

  const snapshot = await getBlogStoriesSnapshot(version);
  applySnapshotCacheLife(snapshot);

  const tagged = snapshot.visibleStories.filter((story) => {
    return (story.tag_list ?? []).some((storyTag) => {
      return storyTag.trim() === normalizedTag;
    });
  });
  const startIndex = pageIndex * BLOG_ARCHIVE_PAGE_SIZE;

  return tagged.slice(startIndex, startIndex + BLOG_ARCHIVE_PAGE_SIZE);
};

export const getAllArticles = async (
  version: "draft" | "published" = "published",
): Promise<BlogStory[]> => {
  const { visibleStories } = await getBlogStoriesSnapshot(version);
  return visibleStories;
};

export const getLatestArticlesSeed = async (
  version: "draft" | "published" = "published",
): Promise<BlogStory[]> => {
  "use cache";
  cacheTag(getBlogVersionTag({ scope: BLOG_SCOPES.latestSeed, version }));

  const snapshot = await getBlogStoriesSnapshot(version);
  applySnapshotCacheLife(snapshot);

  return snapshot.visibleStories.slice(0, SIMILAR_ARTICLES_SEED_SIZE);
};

export const getBlogTags = async (
  version: "draft" | "published" = "published",
): Promise<{ slug: string; count: number }[]> => {
  "use cache";
  cacheTag(getBlogVersionTag({ scope: BLOG_SCOPES.tags, version }));

  const snapshot = await getBlogStoriesSnapshot(version);
  applySnapshotCacheLife(snapshot);

  const counts = new Map<string, number>();
  for (const story of snapshot.visibleStories) {
    for (const tag of story.tag_list ?? []) {
      const slug = tag.trim();
      if (!slug) {
        continue;
      }

      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([slug, count]) => {
      return { slug, count };
    })
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }

      return a.slug.localeCompare(b.slug);
    });
};

export const getArticleBySlug = async ({
  slug,
  version,
}: {
  slug: string;
  version: "draft" | "published";
}): Promise<BlogStory | null> => {
  "use cache";

  const normalizedSlug = slug.trim();
  if (!normalizedSlug) {
    cacheLife("ultraLong");
    return null;
  }
  cacheTag(getBlogArticleSlugTag({ slug: normalizedSlug, version }));

  const story = await fetchStoryBySlug({
    slug: `${BLOG_PREFIX}${normalizedSlug}`,
    version,
  });

  if (!story) {
    cacheLife("ultraLong");
    return null;
  }

  const article = isArticleStory(story as BlogStory)
    ? (story as BlogStory)
    : null;

  if (!article) {
    cacheLife("ultraLong");
    return null;
  }

  if (version === "published" && !isArticleReleased(article)) {
    applyPublishedListingCacheLife(
      getNextUnreleasedReleaseAt([article])?.toISOString() ?? null,
    );
    return null;
  }

  cacheLife("ultraLong");
  return article;
};
