import "server-only";
import type { FC } from "react";
import { Accolade } from "@/components/accolade";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";

type AccoladeBlokData = SbBlokData & {
  title?: string;
  year?: string;
  href?: string;
};

type AccoladeBlokProps = {
  blok: AccoladeBlokData;
};

export const AccoladeBlok: FC<AccoladeBlokProps> = ({ blok }) => {
  if (!blok.title || !blok.year) {
    return null;
  }

  return (
    <Accolade
      {...storyblokEditable(blok)}
      title={blok.title}
      year={blok.year}
      href={blok.href}
    />
  );
};
