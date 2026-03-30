import "server-only";
import type { FC } from "react";
import { Accordion } from "@/components/accordion";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";
import { BlokRenderer } from "@/storyblok/renderer";

type PublicEventChildBlokData = SbBlokData & {
  event_date?: string;
};

type PublicEventsBlokData = SbBlokData & {
  events?: PublicEventChildBlokData[];
};

type PublicEventsBlokProps = {
  blok: PublicEventsBlokData;
};

const getEventTimestamp = (value: string | undefined): number => {
  if (!value) {
    return 0;
  }

  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
};

export const PublicEventsBlok: FC<PublicEventsBlokProps> = ({ blok }) => {
  const events = [...(blok.events ?? [])].sort((left, right) => {
    return (
      getEventTimestamp(right.event_date) - getEventTimestamp(left.event_date)
    );
  });

  if (events.length === 0) {
    return null;
  }

  return (
    <section {...storyblokEditable(blok)}>
      <Accordion className="space-y-5">
        {events.map((eventBlok) => (
          <BlokRenderer blok={eventBlok} key={eventBlok._uid} />
        ))}
      </Accordion>
    </section>
  );
};
