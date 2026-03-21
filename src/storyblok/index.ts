import "server-only";
import { apiPlugin, setComponents, storyblokInit } from "@storyblok/react/rsc";
import { ArticleBlok } from "@/bloks/ArticleBlok";
import { BoxBlok } from "@/bloks/BoxBlok";
import { DividerBlok } from "@/bloks/DividerBlok";
import { FeatureBlok } from "@/bloks/FeatureBlok";
import { GridBlok } from "@/bloks/GridBlok";
import { HeroImageBlok } from "@/bloks/HeroImageBlok";
import { ImageBlok } from "@/bloks/ImageBlok";
import { PageBlok } from "@/bloks/PageBlok";
import { RichTextBlok } from "@/bloks/RichTextBlok";
import { SectionBlok } from "@/bloks/SectionBlok";
import { SnippetBlok } from "@/bloks/SnippetBlok";
import { TableOfContentsBlok } from "@/bloks/TableOfContentsBlok";
import { TeaserBlok } from "@/bloks/TeaserBlok";
import { TypographyBlok } from "@/bloks/TypographyBlok";
import { VerticalSpacingBlok } from "@/bloks/VerticalSpacingBlok";
import { environment } from "@/environment";

const getBlokComponents = () => {
  return {
    article: ArticleBlok,
    box: BoxBlok,
    divider: DividerBlok,
    feature: FeatureBlok,
    grid: GridBlok,
    hero_image: HeroImageBlok,
    image: ImageBlok,
    page: PageBlok,
    rich_text: RichTextBlok,
    section: SectionBlok,
    snippet: SnippetBlok,
    table_of_contents: TableOfContentsBlok,
    teaser: TeaserBlok,
    typography: TypographyBlok,
    vertical_spacing: VerticalSpacingBlok,
  };
};

export const getStoryblokApi = () => {
  const api = storyblokInit({
    accessToken: environment.STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
    apiOptions: {
      region: "eu",
    },
  })();

  // storyblokInit caches a singleton and does not re-apply component maps
  // after first init; rebuild and refresh the registry so blok edits are
  // picked up in dev without restarting.
  setComponents(getBlokComponents());

  return api;
};

export const getStoryblokCv = (): number => {
  return Date.now();
};
