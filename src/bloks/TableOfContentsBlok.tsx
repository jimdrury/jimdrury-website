import "server-only";
import type { FC } from "react";
import { TableOfContents } from "@/components/table-of-contents";
import { asBlogStory } from "@/lib/story-render-context";
import {
  type SbBlokData,
  type StoryRenderProps,
  storyblokEditable,
} from "@/storyblok/lib";
import type { TocHeadingLevel } from "@/storyblok/table-of-contents";

type TableOfContentsBlokData = SbBlokData & {
  max_heading_level?: TocHeadingLevel;
};

type TableOfContentsBlokProps = StoryRenderProps & {
  blok: TableOfContentsBlokData;
};

export const TableOfContentsBlok: FC<TableOfContentsBlokProps> = ({
  blok,
  story,
}) => {
  return (
    <div {...storyblokEditable(blok)}>
      <TableOfContents
        maxHeadingLevel={blok.max_heading_level}
        story={asBlogStory(story)}
      />
    </div>
  );
};
