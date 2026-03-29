import "server-only";
import { type FC, type ReactElement, use } from "react";
import { CitedQuote } from "@/components/cited-quote";
import {
  type SbBlokData,
  type StoryblokRichTextNode,
  storyblokEditable,
} from "@/storyblok/lib";

type CitedQuoteBlokData = SbBlokData & {
  quote?: StoryblokRichTextNode<ReactElement>;
  citation?: string;
  citation_context?: string;
};

type CitedQuoteBlokProps = {
  blok: CitedQuoteBlokData;
};

const getCachedQuote = async (
  quote: StoryblokRichTextNode<ReactElement>,
): Promise<ReactElement> => {
  "use cache";
  // Dynamic import breaks the circular dep: renderer.tsx → CitedQuoteBlok → renderer.tsx
  const { RichText } = await import("@/storyblok/renderer");
  return <RichText doc={quote} />;
};

export const CitedQuoteBlok: FC<CitedQuoteBlokProps> = ({ blok }) => {
  if (!blok.quote || !blok.citation) {
    return null;
  }

  return (
    <CitedQuote
      {...storyblokEditable(blok)}
      quote={use(getCachedQuote(blok.quote))}
      citation={blok.citation}
      citation_context={blok.citation_context}
    />
  );
};
