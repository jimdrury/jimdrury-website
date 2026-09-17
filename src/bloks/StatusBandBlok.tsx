import "server-only";
import type { FC } from "react";

import { StatusBand } from "@/components/status-band";
import {
  type SbBlokData,
  type StoryRenderProps,
  storyblokEditable,
} from "@/storyblok/lib";
import { BlokRenderer } from "@/storyblok/renderer";

type StatusBandBlokData = SbBlokData & {
  badge?: SbBlokData[];
  body?: SbBlokData[];
};

type StatusBandBlokProps = StoryRenderProps & {
  blok: StatusBandBlokData;
};

export const StatusBandBlok: FC<StatusBandBlokProps> = ({
  blok,
  pathname,
  story,
}) => {
  const hasBody = Array.isArray(blok.body) && blok.body.length > 0;
  if (!hasBody) {
    return null;
  }

  const badge = blok.badge?.map((nestedBlok) => (
    <BlokRenderer
      blok={nestedBlok}
      key={nestedBlok._uid}
      pathname={pathname}
      story={story}
    />
  ));

  const body = blok.body?.map((nestedBlok) => (
    <BlokRenderer
      blok={nestedBlok}
      key={nestedBlok._uid}
      pathname={pathname}
      story={story}
    />
  ));

  return (
    <StatusBand {...storyblokEditable(blok)} badge={badge}>
      {body}
    </StatusBand>
  );
};
