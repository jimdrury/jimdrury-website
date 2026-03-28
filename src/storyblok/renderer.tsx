import "server-only";
import { ArticleBlok } from "@/bloks/ArticleBlok";
import { BoxBlok } from "@/bloks/BoxBlok";
import { CitedQuoteBlok } from "@/bloks/CitedQuoteBlok";
import { DividerBlok } from "@/bloks/DividerBlok";
import { FeatureBlok } from "@/bloks/FeatureBlok";
import { GridBlok } from "@/bloks/GridBlok";
import { HeroImageBlok } from "@/bloks/HeroImageBlok";
import { ImageBlok } from "@/bloks/ImageBlok";
import { PageBlok } from "@/bloks/PageBlok";
import { PromptBlok } from "@/bloks/PromptBlok";
import { RichTextBlok } from "@/bloks/RichTextBlok";
import { SectionBlok } from "@/bloks/SectionBlok";
import { SnippetBlok } from "@/bloks/SnippetBlok";
import { TableOfContentsBlok } from "@/bloks/TableOfContentsBlok";
import { TeaserBlok } from "@/bloks/TeaserBlok";
import { TypographyBlok } from "@/bloks/TypographyBlok";
import { VerticalSpacingBlok } from "@/bloks/VerticalSpacingBlok";
import {
  createBlokRenderer,
  createRichText,
  createStoryContent,
} from "@/storyblok/lib";

export const BlokRenderer = createBlokRenderer({
  article: ArticleBlok,
  box: BoxBlok,
  cited_quote: CitedQuoteBlok,
  divider: DividerBlok,
  feature: FeatureBlok,
  grid: GridBlok,
  hero_image: HeroImageBlok,
  image: ImageBlok,
  page: PageBlok,
  prompt: PromptBlok,
  rich_text: RichTextBlok,
  section: SectionBlok,
  snippet: SnippetBlok,
  table_of_contents: TableOfContentsBlok,
  teaser: TeaserBlok,
  typography: TypographyBlok,
  vertical_spacing: VerticalSpacingBlok,
});

export const StoryContent = createStoryContent(BlokRenderer);
export const RichText = createRichText(BlokRenderer);
