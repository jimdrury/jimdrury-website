import "server-only";
import type { FC } from "react";
import { Surface } from "@/components/surface";
import { Typography } from "@/components/typography";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";

type FeatureBlokData = SbBlokData & {
  name?: string;
};

type FeatureBlokProps = {
  blok: FeatureBlokData;
};

export const FeatureBlok: FC<FeatureBlokProps> = ({ blok }) => {
  return (
    <Surface {...storyblokEditable(blok)} className="p-4" padding="sm">
      <Typography asChild size="xl">
        <span>{blok.name}</span>
      </Typography>
    </Surface>
  );
};
