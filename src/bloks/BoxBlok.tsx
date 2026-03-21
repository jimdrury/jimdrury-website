import "server-only";
import {
  type SbBlokData,
  StoryblokServerComponent,
  storyblokEditable,
} from "@storyblok/react/rsc";
import type { FC } from "react";
import {
  Box,
  type BoxBackgroundColour,
  type BoxSpacing,
  type BoxTextColour,
} from "@/components/box";

type BoxBlokData = SbBlokData & {
  body?: SbBlokData[];
  padding?: BoxSpacing;
  margin?: BoxSpacing;
  background_colour?: BoxBackgroundColour;
  text_colour?: BoxTextColour;
};

type BoxBlokProps = {
  blok: BoxBlokData;
};

export const BoxBlok: FC<BoxBlokProps> = ({ blok }) => {
  return (
    <Box
      {...storyblokEditable(blok)}
      padding={blok.padding ?? "md"}
      margin={blok.margin ?? "none"}
      backgroundColour={blok.background_colour ?? "none"}
      textColour={blok.text_colour ?? "default"}
    >
      {blok.body?.map((nestedBlok) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </Box>
  );
};
