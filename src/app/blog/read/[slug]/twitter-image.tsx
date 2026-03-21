import { draftMode } from "next/headers";
import { ImageResponse } from "next/og";

import { getArticleExcerpt } from "@/lib/seo";
import { getArticleBySlug } from "@/storyblok/blog-listings";
import { getFeaturedImageAsset } from "@/storyblok/blog-listings-utils";
import {
  getSocialImageFontOptions,
  SocialImage,
  socialImageAlt,
  socialImageContentType,
  socialImageSize,
  toSocialImagePayload,
} from "./_components/social-image";

export const alt = socialImageAlt;
export const size = socialImageSize;
export const contentType = socialImageContentType;

type TwitterImageProps = Pick<PageProps<"/blog/read/[slug]">, "params">;
type TwitterImageFn = (props: TwitterImageProps) => Promise<ImageResponse>;

const TwitterImage: TwitterImageFn = async ({ params }) => {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const version = isEnabled ? "draft" : "published";
  const story = await getArticleBySlug({ slug, version });
  const featuredImage = getFeaturedImageAsset(story?.content?.featured_image);
  const payload = toSocialImagePayload({
    title: story?.name ?? "Article",
    excerpt:
      (story ? getArticleExcerpt(story) : undefined) ??
      "Read the full article on jimdrury.co.uk",
    featuredImageUrl: featuredImage?.filename,
  });
  const fonts = await getSocialImageFontOptions();

  return new ImageResponse(<SocialImage {...payload} />, {
    ...size,
    fonts,
  });
};

export default TwitterImage;
