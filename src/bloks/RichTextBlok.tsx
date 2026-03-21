import "server-only";
import {
  type SbBlokData,
  type StoryblokRichTextNode,
  StoryblokServerRichText,
  storyblokEditable,
} from "@storyblok/react/rsc";
import type { FC, ReactElement } from "react";

type RichTextBlokData = SbBlokData & {
  content?: StoryblokRichTextNode<ReactElement>;
};

type RichTextBlokProps = {
  blok: RichTextBlokData;
};

export const RichTextBlok: FC<RichTextBlokProps> = ({ blok }) => {
  if (!blok.content) {
    return null;
  }

  return (
    <div
      {...storyblokEditable(blok)}
      className="prose text-pretty richtext-external-link-indicator [&_h1]:text-balance [&_h2]:text-balance [&_h3]:text-balance [&_h4]:text-balance [&_li>p:first-child]:mt-0 [&_li>p:last-child]:mb-0 [&_ul>li::marker]:text-black [&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-black [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-bold [&_:not(pre)>code]:text-yellow-400 [&_:not(pre)>code]:whitespace-nowrap [&_:not(pre)>code]:before:content-none [&_:not(pre)>code]:after:content-none"
    >
      <StoryblokServerRichText doc={blok.content} />
    </div>
  );
};
