import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { readCurrentUtcDay } from "@/lib/article-release";
import { canRenderArticleImage } from "@/lib/article-request-gate";
import { getArticleExcerpt } from "@/lib/seo";
import { sanitizeStoryblokFocusValue } from "@/storyblok/asset-focus";
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
} from "./_components/social-image/social-image";

export const alt = socialImageAlt;
export const size = socialImageSize;
export const contentType = socialImageContentType;

type OpenGraphImageProps = Pick<PageProps<"/blog/[category]/[slug]">, "params">;
type OpenGraphImageFn = (props: OpenGraphImageProps) => Promise<ImageResponse>;

const OpenGraphImage: OpenGraphImageFn = async ({ params }) => {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const version = isEnabled ? "draft" : "published";

  const story = await getArticleBySlug({ slug, version });
  const today = story && !isEnabled ? await readCurrentUtcDay() : "";
  if (!story || !canRenderArticleImage({ story, draft: isEnabled, today })) {
    notFound();
  }

  const featuredImage = getFeaturedImageAsset(story.content?.featured_image);
  const featuredImageUrl = featuredImage?.filename;
  const optimizedFeaturedImageUrl = featuredImageUrl
    ? transformStoryblokImage(featuredImageUrl, {
        width: size.width,
        height: size.height,
        quality: 72,
        focus: sanitizeStoryblokFocusValue(featuredImage?.focus),
      })
    : undefined;

  const payload = toSocialImagePayload({
    title: story.name,
    excerpt:
      getArticleExcerpt(story) ?? "Read the full article on jimdrury.co.uk",
    featuredImageUrl: optimizedFeaturedImageUrl,
  });

  const fonts = await getSocialImageFontOptions();

  return new ImageResponse(<SocialImage {...payload} />, {
    ...size,
    fonts,
  });
};

export default OpenGraphImage;
