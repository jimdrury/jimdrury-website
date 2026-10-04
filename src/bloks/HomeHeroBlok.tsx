import "server-only";
import type { FC } from "react";
import { WindowFrame } from "@/components/window-frame";
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
        <WindowFrame title="home.intro" clip={false} grow>
          <div className="bg-[var(--bg-primary)] p-6 md:p-8 lg:p-12">
            <div className="max-w-[800px]">
              {hasHeading && (
                <div className="mb-4 text-balance [&_h1]:text-[length:var(--text-5xl)] md:mb-6">
                  {heading}
                </div>
              )}
              {hasBody && (
                <div className="text-pretty font-[family-name:var(--font-inter)] text-base leading-[1.6] text-[var(--fg-secondary)] md:text-lg">
                  {body}
                </div>
              )}
            </div>
          </div>
        </WindowFrame>
      </div>
    </section>
  );
};
