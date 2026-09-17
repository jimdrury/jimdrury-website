import "server-only";
import type { FC } from "react";

import { StatusBand } from "@/components/status-band";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";
import { BlokRenderer } from "@/storyblok/renderer";

type StatusBandBlokData = SbBlokData & {
  badge?: SbBlokData[];
  body?: SbBlokData[];
};

type StatusBandBlokProps = {
  blok: StatusBandBlokData;
};

export const StatusBandBlok: FC<StatusBandBlokProps> = ({ blok }) => {
  const hasBody = Array.isArray(blok.body) && blok.body.length > 0;
  if (!hasBody) {
    return null;
  }

  const badge = blok.badge?.map((nestedBlok) => (
    <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
  ));

  const body = blok.body?.map((nestedBlok) => (
    <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
  ));

  return (
    <StatusBand {...storyblokEditable(blok)} badge={badge}>
      {body}
    </StatusBand>
  );
};
