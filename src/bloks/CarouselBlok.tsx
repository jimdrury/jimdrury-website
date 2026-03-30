import "server-only";
import type { FC } from "react";
import { Carousel } from "@/components/carousel";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";
import { BlokRenderer } from "@/storyblok/renderer";

type CarouselBlokData = SbBlokData & {
  title?: string;
  images?: SbBlokData[];
};

type CarouselBlokProps = {
  blok: CarouselBlokData;
};

export const CarouselBlok: FC<CarouselBlokProps> = ({ blok }) => {
  if (!blok.title || !blok.images?.length) {
    return null;
  }

  return (
    <Carousel
      {...storyblokEditable(blok)}
      title={blok.title}
      slides={blok.images.map((imageBlok, index) => ({
        id: imageBlok._uid ?? `${blok._uid ?? "carousel"}-slide-${index}`,
        content: <BlokRenderer blok={imageBlok} />,
      }))}
    />
  );
};
