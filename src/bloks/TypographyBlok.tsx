import "server-only";
import { type FC, Fragment } from "react";
import slugify from "slugify";
import { Typography } from "@/components/typography";
import {
  isTypographySize,
  type TypographySize,
} from "@/components/typography/typography-size";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";

type TypographyTag = "p" | "h1" | "h2" | "h3" | "h4";

type TypographyBlokData = SbBlokData & {
  content?: string;
  as?: string;
  size?: string;
  text_transform?: string;
};

type TypographyBlokProps = {
  blok: TypographyBlokData;
};

/** Default visual scale when CMS `size` is auto / unset (matches legacy blok behavior). */
const CMS_AS_TO_TYPOGRAPHY_SIZE: Record<TypographyTag, TypographySize> = {
  p: "base",
  h1: "3xl",
  h2: "2xl",
  h3: "xl",
  h4: "lg",
};

const getTypographySizeForBlok = ({
  size: sizeField,
  tag,
}: {
  size?: string;
  tag: TypographyTag;
}): TypographySize => {
  const raw = typeof sizeField === "string" ? sizeField.trim() : "";
  if (raw && raw !== "auto" && isTypographySize(raw)) {
    return raw;
  }

  return CMS_AS_TO_TYPOGRAPHY_SIZE[tag];
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

const normalizeTypographyLineBreaks = (value: string): string =>
  value.replaceAll("\\n", "\n");

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

  const slugSource = normalizeTypographyLineBreaks(content)
    .replace(/\s+/g, " ")
    .trim();

  return slugify(slugSource, {
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
  const typographySize = getTypographySizeForBlok({
    size: blok.size,
    tag: Tag,
  });
  const normalizedContent = normalizeTypographyLineBreaks(blok.content);
  const lines = normalizedContent.split("\n");
  const headingId = getHeadingIdFromBlok({
    tag: Tag,
    content: blok.content,
  });

  const textTransform =
    blok.text_transform === "uppercase" ||
    blok.text_transform === "lowercase" ||
    blok.text_transform === "capitalize"
      ? blok.text_transform
      : "none";

  return (
    <Typography
      {...storyblokEditable(blok)}
      asChild
      size={typographySize}
      textTransform={textTransform}
    >
      <Tag
        id={headingId}
        tabIndex={headingId ? -1 : undefined}
        className={headingId ? "scroll-mt-20" : undefined}
      >
        {lines.map((line, index) => (
          // Line order comes from CMS text; index is stable for this static content.
          // biome-ignore lint/suspicious/noArrayIndexKey: keyed by position within blok content
          <Fragment key={`${blok._uid}-line-${index}`}>
            {index > 0 ? <br /> : null}
            {line}
          </Fragment>
        ))}
      </Tag>
    </Typography>
  );
};
