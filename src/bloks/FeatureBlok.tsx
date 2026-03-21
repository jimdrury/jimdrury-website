import { type SbBlokData, storyblokEditable } from "@storyblok/react/rsc";
import type { FC } from "react";
import { Surface } from "@/components/surface";
import { Typography } from "@/components/typography";

type FeatureBlokData = SbBlokData & {
  name?: string;
};

type FeatureBlokProps = {
  blok: FeatureBlokData;
};

export const FeatureBlok: FC<FeatureBlokProps> = ({ blok }) => {
  return (
    <Surface {...storyblokEditable(blok)} className="p-4" padding="sm">
      <Typography as="span" weight="bold">
        {blok.name}
      </Typography>
    </Surface>
  );
};
