import "server-only";
import type { FC } from "react";
import { Typography } from "@/components/typography";
import {
  getCurrentStoryName,
  getCurrentStoryUpdatedAt,
} from "@/lib/current-story-context";
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
        className="mx-auto mt-8 w-full space-y-6 px-4 pb-12 md:pb-14"
        style={{ maxWidth: "72rem" }}
      >
        {blok.body?.map((nestedBlok) => (
          <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
        ))}
      </div>
    </main>
  );
};
