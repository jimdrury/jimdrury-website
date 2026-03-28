import "server-only";
import type { FC } from "react";
import { PublicEvent } from "@/components/public-event";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";

type PublicEventBlokData = SbBlokData & {
  event_date?: string;
  meta?: string;
  title?: string;
  description?: string;
  link_text?: string;
  link_url?: string;
};

type PublicEventBlokProps = {
  blok: PublicEventBlokData;
};

export const PublicEventBlok: FC<PublicEventBlokProps> = ({ blok }) => {
  if (!blok.event_date || !blok.title || !blok.description) {
    return null;
  }

  return (
    <PublicEvent
      {...storyblokEditable(blok)}
      eventDate={blok.event_date}
      meta={blok.meta}
      title={blok.title}
      description={blok.description}
      linkText={blok.link_text}
      linkUrl={blok.link_url}
    />
  );
};
