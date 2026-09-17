import "server-only";
import type { FC } from "react";
import { PageHeader } from "@/components/page-header";
import {
  getStoryName,
  getStoryUpdatedAt,
  useStoryRenderContext,
} from "@/lib/story-render-context";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";
import { BlokRenderer } from "@/storyblok/renderer";

type PageBlokData = SbBlokData & {
  header?: boolean;
  body?: SbBlokData[];
};

type PageBlokProps = {
  blok: PageBlokData;
};

const formatPageUpdatedAt = (value: string | null): string | null => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(parsed);
};

export const PageBlok: FC<PageBlokProps> = ({ blok }) => {
  const { story } = useStoryRenderContext();
  const title = getStoryName(story)?.trim();
  const updatedAtLabel = formatPageUpdatedAt(getStoryUpdatedAt(story));
  const showHeader = blok.header !== false && Boolean(title);

  return (
    <main {...storyblokEditable(blok)} className="pb-6">
      {showHeader && title ? (
        <PageHeader
          title={title}
          subtitle={
            updatedAtLabel ? `Last updated: ${updatedAtLabel}` : undefined
          }
        />
      ) : null}
      {blok.body?.map((nestedBlok) => (
        <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </main>
  );
};
