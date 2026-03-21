# Storyblok Schema <-> Blok Examples

## Typography

- Schema: `schema/components/typography.ts`
- Blok: `src/bloks/TypographyBlok.tsx`
- Registry: `typography: TypographyBlok`

Alignment notes:
- Schema `name: "typography"` becomes registry key `typography`.
- Schema `content` and `as` map to `TypographyBlokData` properties.
- Blok composes reusable UI through `Typography` from `src/components/typography`.

## Section

- Schema: `schema/layout/section.ts`
- Blok: `src/bloks/SectionBlok.tsx`
- Registry: `section: SectionBlok`

Alignment notes:
- Schema options for `max_width` and `background` map to string unions in `SectionBlok`.
- Schema `body` from `blocks(...)` maps to `body?: SbBlokData[]`.
- Blok renders each nested item with `StoryblokServerComponent`.

## Hero Image

- Schema: `schema/components/hero_image.ts`
- Blok: `src/bloks/HeroImageBlok.tsx`
- Registry: `hero_image: HeroImageBlok`

Alignment notes:
- Snake_case schema name maps to PascalCase blok file and export.
- `asset({ name: "image" })` maps to `image?: StoryblokAsset`.
- `blocks({ name: "overlay" })` maps to `overlay?: SbBlokData[]`.

## Article

- Schema: `schema/pages/article.ts`
- Blok: `src/bloks/ArticleBlok.tsx`
- Registry: `article: ArticleBlok`

Alignment notes:
- `featured_image` is a `blocks(...)` field restricted to image component and appears as an array in blok data.
- Metadata-like fields such as `excerpt` or dates should be represented in blok types if consumed.
- Blok composes page-level UI from `src/components/article-hero` and `src/components/typography`.
