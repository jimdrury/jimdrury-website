import "server-only";
import NextImage from "next/image";
import type { FC } from "react";
import { Media, MediaLightbox } from "@/components/media";
import { parseStoryblokImageDimensions } from "@/storyblok/image-dimensions";
import {
  constrainStoryblokDimensions,
  transformStoryblokImage,
} from "@/storyblok/image-transform";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";
import type { StoryblokAsset } from "@/storyblok/types";

const INLINE_IMAGE_WIDTH = 1600;
const INLINE_IMAGE_QUALITY = 78;
const LIGHTBOX_IMAGE_WIDTH = 2400;
const LIGHTBOX_IMAGE_QUALITY = 82;
const ARTICLE_IMAGE_SIZES =
  "(min-width: 1280px) 900px, (min-width: 768px) 66vw, 100vw";

type ImageBlokData = SbBlokData & {
  image?: StoryblokAsset;
  enable_lightbox?: boolean;
};

type ImageBlokProps = {
  blok: ImageBlokData;
};

export const ImageBlok: FC<ImageBlokProps> = ({ blok }) => {
  const src = blok.image?.filename;
  const imageDimensions = parseStoryblokImageDimensions(src);
  const inlineDimensions = imageDimensions
    ? constrainStoryblokDimensions(imageDimensions, INLINE_IMAGE_WIDTH)
    : null;
  const lightboxDimensions = imageDimensions
    ? constrainStoryblokDimensions(imageDimensions, LIGHTBOX_IMAGE_WIDTH)
    : null;
  const inlineSrc = src
    ? transformStoryblokImage(src, {
        width: INLINE_IMAGE_WIDTH,
        quality: INLINE_IMAGE_QUALITY,
      })
    : undefined;
  const lightboxSrc = src
    ? transformStoryblokImage(src, {
        width: LIGHTBOX_IMAGE_WIDTH,
        quality: LIGHTBOX_IMAGE_QUALITY,
      })
    : undefined;
  const alt = blok.image?.alt || blok.image?.meta_data?.alt || "Image";
  const caption =
    blok.image?.title ||
    blok.image?.meta_data?.title ||
    blok.image?.copyright ||
    blok.image?.meta_data?.copyright;

  if (!src) {
    return null;
  }

  const imageElement = imageDimensions ? (
    <NextImage
      src={inlineSrc ?? src}
      alt={alt}
      width={inlineDimensions?.width ?? imageDimensions.width}
      height={inlineDimensions?.height ?? imageDimensions.height}
      sizes={ARTICLE_IMAGE_SIZES}
      style={{ width: "100%", height: "auto" }}
      className="w-full object-cover"
    />
  ) : (
    // biome-ignore lint/performance/noImgElement: fallback when intrinsic size is unknown
    <img src={inlineSrc ?? src} alt={alt} className="w-full object-cover" />
  );

  return (
    <Media {...storyblokEditable(blok)} caption={caption}>
      {blok.enable_lightbox ? (
        <MediaLightbox
          src={lightboxSrc ?? src}
          alt={alt}
          caption={caption}
          imageDimensions={lightboxDimensions}
        >
          {imageElement}
        </MediaLightbox>
      ) : (
        imageElement
      )}
    </Media>
  );
};
