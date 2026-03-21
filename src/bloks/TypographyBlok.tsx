import "server-only";
import { type SbBlokData, storyblokEditable } from "@storyblok/react/rsc";
import type { FC } from "react";
import { Typography } from "@/components/typography";

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

  return (
    <Typography
      {...storyblokEditable(blok)}
      as={blok.as ?? "p"}
      className="whitespace-pre-wrap"
    >
      {blok.content}
    </Typography>
  );
};
