import "server-only";
import type { FC } from "react";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";
import { BlokRenderer } from "@/storyblok/renderer";

type GridSpan =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12";

type GridItemBlokData = SbBlokData & {
  body?: SbBlokData[];
  col_span_mobile?: GridSpan;
  col_span_tablet?: GridSpan;
  col_span_desktop?: GridSpan;
};

type GridItemBlokProps = {
  blok: GridItemBlokData;
};

const toGridColumn = (span: string): string => `span ${span} / span ${span}`;

export const GridItemBlok: FC<GridItemBlokProps> = ({ blok }) => {
  const mobileSpan = blok.col_span_mobile ?? "12";
  const tabletSpan = blok.col_span_tablet ?? "6";
  const desktopSpan = blok.col_span_desktop ?? "4";
  const body = blok.body ?? [];
  const scopeClass = `gi-${blok._uid}`;

  if (body.length === 0) {
    return null;
  }

  return (
    <>
      <style>
        {`.${scopeClass}{grid-column:${toGridColumn(mobileSpan)}}@media(min-width:768px){.${scopeClass}{grid-column:${toGridColumn(tabletSpan)}}}@media(min-width:1024px){.${scopeClass}{grid-column:${toGridColumn(desktopSpan)}}}`}
      </style>
      <div {...storyblokEditable(blok)} className={scopeClass}>
        {body.map((nestedBlok) => (
          <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
        ))}
      </div>
    </>
  );
};
