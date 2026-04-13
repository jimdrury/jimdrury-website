import "server-only";
import type { FC } from "react";
import { PublicEvent } from "@/components/public-event";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";
import { BlokRenderer } from "@/storyblok/renderer";

type PublicEventBlokData = SbBlokData & {
  event_date?: string;
  end_date?: string;
  organizer?: string;
  address?: string;
  performer?: string;
  event_status?: string;
  title?: string;
  description?: string;
  badge?: SbBlokData[];
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

  const [badgeBlok] = blok.badge ?? [];
  const badgeNode =
    badgeBlok?.component === "badge" ? (
      <BlokRenderer blok={badgeBlok} key={badgeBlok._uid} />
    ) : null;

  return (
    <PublicEvent
      {...storyblokEditable(blok)}
      eventDate={blok.event_date}
      endDate={blok.end_date}
      organizer={blok.organizer}
      address={blok.address}
      performer={blok.performer}
      eventStatus={blok.event_status}
      title={blok.title}
      description={blok.description}
      badge={badgeNode}
      linkText={blok.link_text}
      linkUrl={blok.link_url}
    />
  );
};
