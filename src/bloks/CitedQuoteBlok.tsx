import "server-only";
import {
  type SbBlokData,
  type StoryblokRichTextNode,
  StoryblokServerRichText,
  storyblokEditable,
} from "@storyblok/react/rsc";
import { type FC, type ReactElement, use } from "react";
import { CitedQuote } from "@/components/cited-quote";

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
  return <StoryblokServerRichText doc={quote} />;
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
