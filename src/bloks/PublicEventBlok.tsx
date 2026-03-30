import "server-only";
import type { FC } from "react";
import { PublicEvent } from "@/components/public-event";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";
import type { StoryblokAsset } from "@/storyblok/types";

type PublicEventBlokData = SbBlokData & {
  event_date?: string;
  end_date?: string;
  organizer?: string;
  address?: string;
  performer?: string;
  event_status?: string;
  image?: StoryblokAsset;
  is_expanded?: boolean;
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
      endDate={blok.end_date}
      organizer={blok.organizer}
      address={blok.address}
      performer={blok.performer}
      eventStatus={blok.event_status}
      imageUrl={blok.image?.filename}
      defaultExpanded={blok.is_expanded}
      title={blok.title}
      description={blok.description}
      linkText={blok.link_text}
      linkUrl={blok.link_url}
    />
  );
};
