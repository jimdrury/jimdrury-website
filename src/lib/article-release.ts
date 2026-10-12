import "server-only";

import { cacheLife } from "next/cache";
import {
  type ArticleReleaseFields,
  isUnreleasedArticleStory,
} from "@/lib/article-request-gate";

const secondsUntilNextUtcDay = (now: Date): number => {
  const nextDay = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
  );

  return Math.max(2, Math.ceil((nextDay - now.getTime()) / 1000));
};

export const readCurrentUtcDay = async (): Promise<string> => {
  "use cache";

  const now = new Date();
  const expire = secondsUntilNextUtcDay(now);
  cacheLife({
    stale: Math.min(60, expire - 1),
    revalidate: expire - 1,
    expire,
  });

  return now.toISOString().slice(0, 10);
};

export const isUnreleasedPublishedArticle = async (
  story: ArticleReleaseFields | null,
): Promise<boolean> => {
  const component =
    story &&
    typeof story.content === "object" &&
    story.content !== null &&
    "component" in story.content
      ? story.content.component
      : undefined;

  if (component !== "article") {
    return false;
  }

  return isUnreleasedArticleStory(story, await readCurrentUtcDay());
};
