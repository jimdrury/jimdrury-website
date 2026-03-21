---
name: storyblok-components
description: Keeps Storyblok schema definitions in `schema/` aligned with rendering bloks in `src/bloks/` and component registration in `src/storyblok/index.ts`. Use when creating, refactoring, or reviewing Storyblok components, schema fields, blok props, or schema-to-blok mappings.
---

# Storyblok Components

## Purpose

Keep Storyblok component schema and runtime blok rendering aligned.

## Scope

- `schema/**/*.ts`
- `src/bloks/**/*.tsx`
- `src/storyblok/index.ts`

## Canonical alignment rules

1. Every Storyblok component `name` in schema must have a matching key in `getBlokComponents()` in `src/storyblok/index.ts`.
2. Every mapped key should resolve to a blok component named `PascalCaseBlok` in `src/bloks`.
3. Schema field names map directly to blok data properties (snake_case is preserved).
4. Nested blocks (`blocks(...)` fields) map to `SbBlokData[]` fields rendered with `StoryblokServerComponent`.
5. Leaf blocks with required content should return `null` when that content is missing at runtime.

## Naming conventions in this repository

- **Schema component names**: lowercase snake_case (`hero_image`, `vertical_spacing`, `rich_text`).
- **Schema files**: snake_case file names (`schema/components/hero_image.ts`).
- **Blok files**: `PascalCaseBlok.tsx` (`src/bloks/HeroImageBlok.tsx`).
- **Blok exports**: named exports (`export const HeroImageBlok`).
- **Registry keys**: raw schema names (`hero_image: HeroImageBlok`).

## Schema authoring style

- Default-export `contentType(...)` for root entries and `nestable(...)` for reusable blocks.
- Keep imports minimal: only pull factories used in that file.
- Use `folder` consistently (`pages`, `layout`, `components`).
- Use `blocks({ allowed_folders: [...] })` for nested composition constraints.
- Use tabs for grouped configuration (for example `tab({ name: "metadata", fields: [...] })`).

For schema DSL details, follow:
- `node_modules/@jimdrury/storyblok-component-schema/skills/create-component/SKILL.md`

## Blok authoring style

- Put `import "server-only"` at top-level in blok modules.
- Type blok data as `SbBlokData & { ... }`.
- Type components as `FC<Props>` with explicit React type imports.
- Use `storyblokEditable(blok)` on the root rendered element.
- Render nested bloks with:
  - `blok.<field>?.map((nestedBlok) => <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />)`
- Adapt data into reusable UI components from `src/components` instead of duplicating UI markup.

## Synchronization workflow

Copy and follow:

```text
Task Progress:
- [ ] Inventory schema component names and files in `schema/`
- [ ] Inventory blok component files and registry entries
- [ ] Verify schema name -> registry key -> Blok component chain
- [ ] Verify schema fields are represented in blok data types
- [ ] Verify nested block fields are rendered via StoryblokServerComponent
- [ ] Add or update missing schema, blok, and registry entries together
- [ ] Validate naming consistency (snake_case schema, PascalCaseBlok runtime)
- [ ] Run lint/type checks for touched files
```

## Field-to-prop mapping rules

- `text`, `textarea`, `option`, `boolean`, `datetime`:
  - map to optional scalar props on `*BlokData` unless runtime guarantees strict presence.
- `asset`:
  - map to `StoryblokAsset`-like object and read `filename`, `alt`, metadata safely.
- `richtext`:
  - map to `StoryblokRichTextNode<ReactElement>` and render with `StoryblokServerRichText`.
- `blocks`:
  - map to arrays (`SbBlokData[]` or narrower typed arrays) and render nested server components.

## Review checklist

- [ ] Schema component exists in `schema/` and has the intended `name`.
- [ ] Matching blok file exists in `src/bloks/` with expected `PascalCaseBlok` name.
- [ ] `src/storyblok/index.ts` maps schema `name` to the blok component.
- [ ] Blok data type includes each schema field with matching property name.
- [ ] Nested fields from `blocks(...)` are rendered using `StoryblokServerComponent`.
- [ ] Blok uses `storyblokEditable` on its root element when rendering content.
- [ ] Blok composes `src/components` primitives for UI concerns.

## Additional resources

- Repository examples: [examples.md](examples.md)
- React component conventions: `/.cursor/skills/react-component-writing/SKILL.md`
