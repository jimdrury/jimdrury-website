import "server-only";
import type { FC } from "react";
import { Accolades } from "@/components/accolades";
import {
  type SbBlokData,
  type StoryRenderProps,
  storyblokEditable,
} from "@/storyblok/lib";
import { BlokRenderer } from "@/storyblok/renderer";

type AccoladesBlokData = SbBlokData & {
  title?: string;
  awards?: SbBlokData[];
};

type AccoladesBlokProps = StoryRenderProps & {
  blok: AccoladesBlokData;
};

export const AccoladesBlok: FC<AccoladesBlokProps> = ({
  blok,
  pathname,
  story,
}) => {
  const awards = blok.awards ?? [];
  if (awards.length === 0) {
    return null;
  }

  return (
    <Accolades
      {...storyblokEditable(blok)}
      title={blok.title?.trim() || "Accolades"}
    >
      {awards.map((nestedBlok) => (
        <BlokRenderer
          blok={nestedBlok}
          key={nestedBlok._uid}
          pathname={pathname}
          story={story}
        />
      ))}
    </Accolades>
  );
};
