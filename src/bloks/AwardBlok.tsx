import "server-only";
import type { FC, ReactElement } from "react";
import { Award, type AwardColour, type AwardIcon } from "@/components/award";
import {
  type SbBlokData,
  type StoryblokRichTextNode,
  storyblokEditable,
} from "@/storyblok/lib";
import { RichText } from "@/storyblok/renderer";

type AwardBlokData = SbBlokData & {
  icon?: AwardIcon;
  title?: string;
  company?: string;
  colour?: AwardColour;
  description?: StoryblokRichTextNode<ReactElement>;
};

type AwardBlokProps = {
  blok: AwardBlokData;
};

export const AwardBlok: FC<AwardBlokProps> = ({ blok }) => {
  if (!blok.icon || !blok.title) {
    return null;
  }

  return (
    <Award
      {...storyblokEditable(blok)}
      icon={blok.icon}
      title={blok.title}
      company={blok.company}
      colour={blok.colour}
    >
      {blok.description && <RichText doc={blok.description} />}
    </Award>
  );
};
