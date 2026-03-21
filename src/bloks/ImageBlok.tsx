import "server-only";
import { type SbBlokData, storyblokEditable } from "@storyblok/react/rsc";
import NextImage from "next/image";
import type { FC } from "react";
import { Media } from "@/components/media";
import { parseStoryblokImageDimensions } from "@/storyblok/image-dimensions";
import type { StoryblokAsset } from "@/storyblok/types";

type ImageBlokData = SbBlokData & {
  image?: StoryblokAsset;
};

type ImageBlokProps = {
  blok: ImageBlokData;
};

export const ImageBlok: FC<ImageBlokProps> = ({ blok }) => {
  const src = blok.image?.filename;
  const imageDimensions = parseStoryblokImageDimensions(src);
  const alt = blok.image?.alt || blok.image?.meta_data?.alt || "Image";
  const caption =
    blok.image?.title ||
    blok.image?.meta_data?.title ||
    blok.image?.copyright ||
    blok.image?.meta_data?.copyright;

  if (!src) {
    return null;
  }

  return (
    <Media {...storyblokEditable(blok)} caption={caption}>
      {imageDimensions ? (
        <NextImage
          src={src}
          alt={alt}
          width={imageDimensions.width}
          height={imageDimensions.height}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          className="w-full object-cover"
        />
      ) : (
        // biome-ignore lint/performance/noImgElement: fallback when intrinsic size is unknown
        <img src={src} alt={alt} className="w-full object-cover" />
      )}
    </Media>
  );
};
