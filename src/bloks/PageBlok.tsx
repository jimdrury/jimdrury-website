import "server-only";
import type { FC } from "react";
import { Typography } from "@/components/typography";
import {
  getCurrentStoryName,
  getCurrentStoryUpdatedAt,
} from "@/lib/current-story-context";
import { cn } from "@/lib/utils";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";
import { BlokRenderer } from "@/storyblok/renderer";

type PageBlokData = SbBlokData & {
  body?: SbBlokData[];
};

type PageBlokProps = {
  blok: PageBlokData;
};

export const PageBlok: FC<PageBlokProps> = ({ blok }) => {
  const pageTitle = getCurrentStoryName() ?? "Page";
  const updatedAt = getCurrentStoryUpdatedAt();
  const parsedUpdatedAt = updatedAt ? new Date(updatedAt) : null;
  const hasValidUpdatedAt =
    parsedUpdatedAt && !Number.isNaN(parsedUpdatedAt.valueOf());
  const updatedAtLabel = hasValidUpdatedAt
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(parsedUpdatedAt)
    : null;

  return (
    <main {...storyblokEditable(blok)}>
      <section className="w-full bg-black">
        <div className="aspect-[32/9] md:aspect-[40/7] lg:aspect-[48/7]" />
      </section>
      <div className="relative z-10 mx-auto -mt-12 w-full max-w-6xl px-4">
        <div className="rounded-md border-4 border-black bg-yellow-300 p-6 shadow-[8px_8px_0_0] shadow-black">
          <Typography as="h1" size="3xl" weight="black">
            {pageTitle}
          </Typography>
          {updatedAtLabel ? (
            <Typography as="p" size="xs" weight="bold" className="mt-2">
              Last updated: {updatedAtLabel}
            </Typography>
          ) : null}
        </div>
      </div>
      <div
        className={cn(
          "mx-auto mt-8 max-w-6xl px-4 pb-12 md:pb-14 gap-y-6 flex flex-col",
          "md:grid md:gap-x-10 md:gap-y-0",
          "md:[grid-template-columns:minmax(0,3fr)_minmax(0,1fr)]",
          "lg:gap-x-12",
          "lg:[grid-template-columns:minmax(0,5fr)_minmax(0,2fr)]",
        )}
      >
        <section className="space-y-4 pb-0 md:col-start-1 md:row-start-1 md:pb-4">
          {blok.body?.map((nestedBlok) => (
            <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
          ))}
        </section>
        <aside
          aria-hidden="true"
          className="hidden md:col-start-2 md:row-start-1 md:block md:self-start"
        />
      </div>
    </main>
  );
};
