import { draftMode } from "next/headers";
import { ImageResponse } from "next/og";

import { getArticleExcerpt } from "@/lib/seo";
import { getArticleBySlug } from "@/storyblok/blog-listings";
import { getFeaturedImageAsset } from "@/storyblok/blog-listings-utils";
import { transformStoryblokImage } from "@/storyblok/image-transform";
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
  const featuredImageUrl = featuredImage?.filename;
  const optimizedFeaturedImageUrl = featuredImageUrl
    ? transformStoryblokImage(featuredImageUrl, {
        width: size.width,
        height: size.height,
        quality: 72,
      })
    : undefined;
  const payload = toSocialImagePayload({
    title: story?.name ?? "Article",
    excerpt:
      (story ? getArticleExcerpt(story) : undefined) ??
      "Read the full article on jimdrury.co.uk",
    featuredImageUrl: optimizedFeaturedImageUrl,
  });
  const fonts = await getSocialImageFontOptions();

  return new ImageResponse(<SocialImage {...payload} />, {
    ...size,
    fonts,
  });
};

export default TwitterImage;
