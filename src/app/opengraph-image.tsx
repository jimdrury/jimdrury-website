import { ImageResponse } from "next/og";
import {
  DefaultSocialImage,
  defaultSocialImageAlt,
  defaultSocialImageContentType,
  defaultSocialImageSize,
} from "./_components/default-social-image/default-social-image";

export const alt = defaultSocialImageAlt;
export const size = defaultSocialImageSize;
export const contentType = defaultSocialImageContentType;

const OpenGraphImage = () => {
  return new ImageResponse(<DefaultSocialImage />, { ...size });
};

export default OpenGraphImage;
