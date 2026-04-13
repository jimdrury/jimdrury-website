import "server-only";
import type { FC } from "react";

import { Badge, type BadgeProps } from "@/components/badge";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";

type BadgeBlokData = SbBlokData & {
  label?: string;
  variant?: BadgeProps["variant"];
};

type BadgeBlokProps = {
  blok: BadgeBlokData;
};

export const BadgeBlok: FC<BadgeBlokProps> = ({ blok }) => {
  if (!blok.label) {
    return null;
  }

  return (
    <Badge {...storyblokEditable(blok)} variant={blok.variant ?? "highlight"}>
      {blok.label}
    </Badge>
  );
};
