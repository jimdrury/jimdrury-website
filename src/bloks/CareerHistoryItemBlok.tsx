import "server-only";
import type { FC, ReactElement } from "react";
import type { CareerHistoryColour } from "@/components/career-history";
import { CareerHistoryItem } from "@/components/career-history";
import {
  type SbBlokData,
  type StoryblokRichTextNode,
  storyblokEditable,
} from "@/storyblok/lib";
import { RichText } from "@/storyblok/renderer";

type CareerHistoryItemBlokData = SbBlokData & {
  from?: string;
  to?: string;
  role?: string;
  company?: string;
  website_url?: string;
  colour?: CareerHistoryColour;
  description?: StoryblokRichTextNode<ReactElement>;
};

type CareerHistoryItemBlokProps = {
  blok: CareerHistoryItemBlokData;
};

export const CareerHistoryItemBlok: FC<CareerHistoryItemBlokProps> = ({
  blok,
}) => {
  if (!blok.from || !blok.role || !blok.company || !blok.description) {
    return null;
  }

  return (
    <CareerHistoryItem
      {...storyblokEditable(blok)}
      from={blok.from}
      to={blok.to}
      role={blok.role}
      company={blok.company}
      companyWebsiteUrl={blok.website_url}
      colour={blok.colour}
      description={<RichText doc={blok.description} />}
    />
  );
};
