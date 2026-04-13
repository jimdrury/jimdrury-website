import "server-only";
import type { FC } from "react";
import { MediaVideoLink } from "@/components/media-video-link";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";

type MediaVideoLinkBlokData = SbBlokData & {
  title?: string;
  description?: string;
  youtube_url?: string;
};

type MediaVideoLinkBlokProps = {
  blok: MediaVideoLinkBlokData;
};

export const MediaVideoLinkBlok: FC<MediaVideoLinkBlokProps> = ({ blok }) => {
  if (!blok.title || !blok.youtube_url) {
    return null;
  }

  return (
    <MediaVideoLink
      {...storyblokEditable(blok)}
      title={blok.title}
      youtubeUrl={blok.youtube_url}
      description={blok.description}
    />
  );
};
