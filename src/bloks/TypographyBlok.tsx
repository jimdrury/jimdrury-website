import "server-only";
import type { FC } from "react";
import slugify from "slugify";
import { Typography, type TypographySize } from "@/components/typography";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";

type TypographyTag = "p" | "h1" | "h2" | "h3" | "h4";

type TypographyBlokData = SbBlokData & {
  content?: string;
  as?: string;
};

type TypographyBlokProps = {
  blok: TypographyBlokData;
};

const CMS_AS_TO_TYPOGRAPHY_SIZE: Record<TypographyTag, TypographySize> = {
  p: "md",
  h1: "3xl",
  h2: "2xl",
  h3: "xl",
  h4: "lg",
};

const getElementTagFromAs = (as?: string): TypographyTag => {
  const normalizedAs = (as ?? "").toLowerCase().trim();

  switch (normalizedAs) {
    case "h1":
      return "h1";
    case "h2":
      return "h2";
    case "h3":
      return "h3";
    case "h4":
      return "h4";
    default:
      return "p";
  }
};

const getHeadingIdFromBlok = ({
  tag,
  content,
}: {
  tag: TypographyTag;
  content: string;
}): string | undefined => {
  if (tag !== "h1" && tag !== "h2" && tag !== "h3") {
    return undefined;
  }

  return slugify(content, {
    lower: true,
    strict: true,
    trim: true,
  });
};

export const TypographyBlok: FC<TypographyBlokProps> = ({ blok }) => {
  if (!blok.content) {
    return null;
  }

  const Tag = getElementTagFromAs(blok.as);
  const typographySize = CMS_AS_TO_TYPOGRAPHY_SIZE[Tag];
  const headingId = getHeadingIdFromBlok({
    tag: Tag,
    content: blok.content,
  });

  return (
    <Typography {...storyblokEditable(blok)} asChild size={typographySize}>
      <Tag
        id={headingId}
        tabIndex={headingId ? -1 : undefined}
        className={
          headingId ? "whitespace-pre-wrap scroll-mt-20" : "whitespace-pre-wrap"
        }
      >
        {blok.content}
      </Tag>
    </Typography>
  );
};
