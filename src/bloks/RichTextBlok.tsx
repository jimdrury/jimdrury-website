import "server-only";
import { type FC, type ReactElement, use } from "react";
import {
  type SbBlokData,
  type StoryblokRichTextNode,
  type StoryRenderProps,
  storyblokEditable,
} from "@/storyblok/lib";
import { RichText } from "@/storyblok/renderer";

type RichTextBlokData = SbBlokData & {
  content?: StoryblokRichTextNode<ReactElement>;
};

type RichTextBlokProps = StoryRenderProps & {
  blok: RichTextBlokData;
};

const getCachedRichText = async (
  doc: StoryblokRichTextNode<ReactElement>,
  pathname: string,
  story: RichTextBlokProps["story"],
): Promise<ReactElement> => {
  "use cache";
  return <RichText doc={doc} pathname={pathname} story={story} />;
};

export const RichTextBlok: FC<RichTextBlokProps> = ({
  blok,
  pathname,
  story,
}) => {
  if (!blok.content) {
    return null;
  }

  return (
    <div
      {...storyblokEditable(blok)}
      className="prose text-pretty richtext-external-link-indicator [&_h1]:text-balance [&_h2]:text-balance [&_h3]:text-balance [&_h4]:text-balance [&_ul>li::marker]:text-black [&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-black [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-bold [&_:not(pre)>code]:text-yellow-400 [&_:not(pre)>code]:whitespace-nowrap [&_:not(pre)>code]:max-sm:whitespace-normal [&_:not(pre)>code]:max-sm:break-words [&_:not(pre)>code]:before:content-none [&_:not(pre)>code]:after:content-none"
    >
      {use(getCachedRichText(blok.content, pathname, story))}
    </div>
  );
};
