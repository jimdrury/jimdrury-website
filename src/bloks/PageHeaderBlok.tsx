import "server-only";
import type { FC, ReactElement } from "react";

import { PageHeader } from "@/components/page-header";
import {
  type SbBlokData,
  type StoryblokRichTextNode,
  storyblokEditable,
} from "@/storyblok/lib";
import { BlokRenderer, RichText } from "@/storyblok/renderer";

type PageHeaderBlokData = SbBlokData & {
  badge?: SbBlokData[];
  title?: string;
  subtitle?: StoryblokRichTextNode<ReactElement>;
};

type PageHeaderBlokProps = {
  blok: PageHeaderBlokData;
};

const hasRichTextContent = (
  doc: StoryblokRichTextNode<ReactElement> | undefined,
): doc is StoryblokRichTextNode<ReactElement> => {
  if (!doc || doc.type !== "doc") return false;
  const content = doc.content;
  if (!Array.isArray(content) || content.length === 0) return false;
  return content.some(
    (node) =>
      Array.isArray(node.content) &&
      node.content.some(
        (child) => typeof child.text === "string" && child.text.length > 0,
      ),
  );
};

export const PageHeaderBlok: FC<PageHeaderBlokProps> = ({ blok }) => {
  if (!blok.title) {
    return null;
  }

  const subtitle = hasRichTextContent(blok.subtitle) ? (
    <RichText doc={blok.subtitle} />
  ) : null;
  const badge = blok.badge?.map((nestedBlok) => (
    <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
  ));

  return (
    <div {...storyblokEditable(blok)}>
      <PageHeader badge={badge} title={blok.title} subtitle={subtitle} />
    </div>
  );
};
