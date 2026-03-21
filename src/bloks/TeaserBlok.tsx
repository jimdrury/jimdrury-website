import { type SbBlokData, storyblokEditable } from "@storyblok/react/rsc";
import type { FC } from "react";
import { Surface } from "@/components/surface";
import { Typography } from "@/components/typography";

type TeaserBlokData = SbBlokData & {
  headline?: string;
};

type TeaserBlokProps = {
  blok: TeaserBlokData;
};

export const TeaserBlok: FC<TeaserBlokProps> = ({ blok }) => {
  return (
    <Surface {...storyblokEditable(blok)} className="p-4">
      <Typography as="h2" size="2xl" weight="bold">
        {blok.headline}
      </Typography>
    </Surface>
  );
};
