import "server-only";
import { AccoladeBlok } from "@/bloks/AccoladeBlok";
import { ArticleBlok } from "@/bloks/ArticleBlok";
import { BoxBlok } from "@/bloks/BoxBlok";
import { CareerHistoryItemBlok } from "@/bloks/CareerHistoryItemBlok";
import { CitedQuoteBlok } from "@/bloks/CitedQuoteBlok";
import { DividerBlok } from "@/bloks/DividerBlok";
import { FeatureBlok } from "@/bloks/FeatureBlok";
import { GridBlok } from "@/bloks/GridBlok";
import { GridItemBlok } from "@/bloks/GridItemBlok";
import { HeroBlok } from "@/bloks/HeroBlok";
import { ImageBlok } from "@/bloks/ImageBlok";
import { MediaVideoLinkBlok } from "@/bloks/MediaVideoLinkBlok";
import { PageBlok } from "@/bloks/PageBlok";
import { PromptBlok } from "@/bloks/PromptBlok";
import { PublicEventBlok } from "@/bloks/PublicEventBlok";
import { PublicEventsBlok } from "@/bloks/PublicEventsBlok";
import { RichTextBlok } from "@/bloks/RichTextBlok";
import { SectionBlok } from "@/bloks/SectionBlok";
import { SimilarArticlesBlok } from "@/bloks/SimilarArticlesBlok";
import { SnippetBlok } from "@/bloks/SnippetBlok";
import { TableOfContentsBlok } from "@/bloks/TableOfContentsBlok";
import { TypographyBlok } from "@/bloks/TypographyBlok";
import { VerticalSpacingBlok } from "@/bloks/VerticalSpacingBlok";
import {
  createBlokRenderer,
  createRichText,
  createStoryContent,
} from "@/storyblok/lib";

export const BlokRenderer = createBlokRenderer({
  accolade: AccoladeBlok,
  article: ArticleBlok,
  box: BoxBlok,
  career_history_item: CareerHistoryItemBlok,
  cited_quote: CitedQuoteBlok,
  divider: DividerBlok,
  feature: FeatureBlok,
  grid: GridBlok,
  grid_item: GridItemBlok,
  hero: HeroBlok,
  image: ImageBlok,
  media_video_link: MediaVideoLinkBlok,
  page: PageBlok,
  prompt: PromptBlok,
  public_event: PublicEventBlok,
  public_events: PublicEventsBlok,
  rich_text: RichTextBlok,
  section: SectionBlok,
  similar_articles: SimilarArticlesBlok,
  snippet: SnippetBlok,
  table_of_contents: TableOfContentsBlok,
  typography: TypographyBlok,
  vertical_spacing: VerticalSpacingBlok,
});

export const StoryContent = createStoryContent(BlokRenderer);
export const RichText = createRichText(BlokRenderer);
