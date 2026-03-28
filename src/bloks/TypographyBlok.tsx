import "server-only";
import type { FC } from "react";
import { Typography } from "@/components/typography";
import { getCurrentStory } from "@/lib/current-story-context";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";
import { getTypographyHeadingIdByUid } from "@/storyblok/table-of-contents";

type TypographyTag = "p" | "h1" | "h2" | "h3" | "h4";

type TypographyBlokData = SbBlokData & {
  content?: string;
  as?: TypographyTag;
};

type TypographyBlokProps = {
  blok: TypographyBlokData;
};

export const TypographyBlok: FC<TypographyBlokProps> = ({ blok }) => {
  if (!blok.content) {
    return null;
  }

  const story = getCurrentStory();
  const headingId =
    blok.as === "h2" || blok.as === "h3" || blok.as === "h4"
      ? getTypographyHeadingIdByUid({
          uid: blok._uid,
          story,
          content: blok.content,
        })
      : undefined;

  return (
    <Typography
      {...storyblokEditable(blok)}
      as={blok.as ?? "p"}
      id={headingId}
      tabIndex={headingId ? -1 : undefined}
      className={
        headingId ? "whitespace-pre-wrap scroll-mt-20" : "whitespace-pre-wrap"
      }
    >
      {blok.content}
    </Typography>
  );
};
