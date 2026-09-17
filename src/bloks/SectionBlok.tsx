import "server-only";
import type { FC } from "react";
import {
  Section,
  type SectionBackground,
  type SectionMaxWidth,
  type SectionPadding,
} from "@/components/section";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";
import { BlokRenderer } from "@/storyblok/renderer";

type SectionBlokData = SbBlokData & {
  max_width?: SectionMaxWidth;
  background?: SectionBackground;
  padding_top?: SectionPadding;
  padding_bottom?: SectionPadding;
  body?: SbBlokData[];
};

type SectionBlokProps = {
  blok: SectionBlokData;
};

export const SectionBlok: FC<SectionBlokProps> = ({ blok }) => {
  return (
    <Section
      {...storyblokEditable(blok)}
      maxWidth={blok.max_width}
      background={blok.background}
      paddingTop={blok.padding_top}
      paddingBottom={blok.padding_bottom}
    >
      {blok.body?.map((nestedBlok) => (
        <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </Section>
  );
};
