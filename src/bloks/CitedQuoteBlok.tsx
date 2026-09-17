import "server-only";
import { type FC, type ReactElement, use } from "react";
import { CitedQuote } from "@/components/cited-quote";
import {
  type SbBlokData,
  type StoryblokRichTextNode,
  type StoryRenderProps,
  storyblokEditable,
} from "@/storyblok/lib";

type CitedQuoteBlokData = SbBlokData & {
  quote?: StoryblokRichTextNode<ReactElement>;
  citation?: string;
  citation_context?: string;
};

type CitedQuoteBlokProps = StoryRenderProps & {
  blok: CitedQuoteBlokData;
};

const getCachedQuote = async (
  quote: StoryblokRichTextNode<ReactElement>,
  pathname: string,
  story: CitedQuoteBlokProps["story"],
): Promise<ReactElement> => {
  "use cache";
  // Dynamic import breaks the circular dep: renderer.tsx → CitedQuoteBlok → renderer.tsx
  const { RichText } = await import("@/storyblok/renderer");
  return <RichText doc={quote} pathname={pathname} story={story} />;
};

export const CitedQuoteBlok: FC<CitedQuoteBlokProps> = ({
  blok,
  pathname,
  story,
}) => {
  if (!blok.quote || !blok.citation) {
    return null;
  }

  return (
    <CitedQuote
      {...storyblokEditable(blok)}
      quote={use(getCachedQuote(blok.quote, pathname, story))}
      citation={blok.citation}
      citation_context={blok.citation_context}
    />
  );
};
