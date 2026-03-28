import "server-only";
import type { FC } from "react";
import { MediaVideoLink } from "@/components/media-video-link";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";

type MediaVideoLinkBlokData = SbBlokData & {
  title?: string;
  meta?: string;
  description?: string;
  youtube_url?: string;
  cta_text?: string;
  channel?: string;
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
      meta={blok.meta}
      description={blok.description}
      ctaText={blok.cta_text}
      channel={blok.channel}
    />
  );
};
