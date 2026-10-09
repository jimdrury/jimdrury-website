import "server-only";
import type { FC } from "react";
import {
  type SbBlokData,
  type StoryRenderProps,
  storyblokEditable,
} from "@/storyblok/lib";
import { BlokRenderer } from "@/storyblok/renderer";

type HomeHeroBlokData = SbBlokData & {
  heading?: SbBlokData[];
  body?: SbBlokData[];
};

type HomeHeroBlokProps = StoryRenderProps & {
  blok: HomeHeroBlokData;
};

export const HomeHeroBlok: FC<HomeHeroBlokProps> = ({
  blok,
  pathname,
  story,
}) => {
  const hasHeading = Array.isArray(blok.heading) && blok.heading.length > 0;
  const hasBody = Array.isArray(blok.body) && blok.body.length > 0;

  if (!hasHeading && !hasBody) {
    return null;
  }

  const heading = blok.heading?.map((nestedBlok) => (
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
    <section
      {...storyblokEditable(blok)}
      className="w-full bg-[var(--bg-primary)] py-8 md:py-12 lg:py-16"
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 lg:px-12">
        <div className="rounded-xl border-[3px] border-[var(--fg-primary)] bg-[var(--bg-primary)] p-6 shadow-[8px_8px_0_0_var(--fg-primary)] md:p-8 lg:p-12">
          <div className="max-w-[800px]">
            {hasHeading && (
              <div className="mb-4 text-balance md:mb-6">{heading}</div>
            )}
            {hasBody && (
              <div className="text-pretty font-[family-name:var(--font-inter)] text-base leading-[1.6] text-[var(--fg-secondary)] md:text-lg">
                {body}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
