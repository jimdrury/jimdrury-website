---
name: nextjs-page-layout-conventions
description: Defines Next.js App Router entry-file conventions for this repository, including FC typing with generated route props, arrow-function component style, default exports, and Cache Components ISR via generateStaticParams instead of page-level Suspense. Use when creating, refactoring, or reviewing route files in `src/app`.
---

# Next.js Page and Layout Conventions

## Purpose

Apply one canonical authoring style for App Router entry files in this repository.

## Scope

- `src/app/**/page.tsx`
- `src/app/**/layout.tsx`
- `src/app/**/template.tsx` (when present)
- metadata exports in those files (`metadata`, `generateMetadata`)
- route-local files in `src/app/**/_components` and `src/app/**/_helpers`

## Non-negotiable rules

1. Type route entry components with `FC<...>` using generated route props (`PageProps` / `LayoutProps`).
2. Route entry components are arrow-function components.
3. Route entry components are default exports (framework entrypoint exception).
4. React types are explicitly imported from `react`.
5. Keep entry files server-safe by default; add `"use client"` only when required.
6. Dynamic routes export `generateStaticParams` with every published path so Cache Components can prerender them. Do not wrap page content in `<Suspense>` to unlock params; that produces a streaming shell instead of blocking ISR.
7. `generateStaticParams` must return at least one real param. Unknown paths still generate on demand (`dynamicParams` defaults to `true`).
8. Route entry component names are fixed by file convention: use `const Page` in `page.tsx` and `const Layout` in `layout.tsx`.
9. Route-specific UI used by a colocated `_components/render/render.tsx` stays in that route `_components/<name>/` folder and is imported with relative paths. `_components/render/render.tsx` is a server component and must include `import "server-only"`. Route-local helpers belong in `_helpers/`.

## Canonical typing rule

Use generated route prop types as the `FC` generic:

- For a static route like `/blog`: `FC<PageProps<"/blog">>`
- For a dynamic route like `/blog/[slug]`: `FC<PageProps<"/blog/[slug]">>`

This keeps params and search params aligned with generated Next route typing.

## Canonical component pattern

```ts
import type { FC } from "react";

const Page: FC<PageProps<"/blog">> = async () => {
  return <main>{/* ... */}</main>;
};

export default Page;
```

Key constraints:

- Use `const ComponentName: FC<...> = (...) => { ... }`
- In `page.tsx`, the component identifier must be `Page`
- In `layout.tsx`, the component identifier must be `Layout`
- Export at file bottom with `export default ComponentName`
- Do not use function declarations for route entry components

## Cache Components ISR pattern

With `cacheComponents` enabled, this site prerenders published pages (ISR / incremental static generation):

- Export `generateStaticParams` from every dynamic `page.tsx`.
- Await `params` in the page or colocated `_components/render/render.tsx`. Known params resolve at prerender time, so no page-level `<Suspense>` is required.
- Cache Storyblok reads with `"use cache"` and `cacheLife` / `cacheTag`.
- `draftMode()` is allowed at the top of a page. During prerender it is off; draft requests render dynamically.
- Do not await `searchParams` in page content. Query strings are request-only and would block prerender. Encode paginated or filtered views in the path and include those paths in `generateStaticParams`.
- Do not call `connection()` on prerendered pages.

`page.tsx` stays the route entry. Keep async Storyblok work in `_components/render/render.tsx` when the file would otherwise get large.

Required placement for CMS routes:

- `src/app/**/page.tsx` — `generateStaticParams`, metadata, default `Page`
- `src/app/**/_components/render/render.tsx` — async server body (`import "server-only"`)
- Route-specific UI used by `render.tsx`: `src/app/**/_components/<name>/`
- Route-local data helpers: `src/app/**/_helpers/`

Rationale:

- `generateStaticParams` makes `params` known at build, so the full page HTML can prerender.
- A page-level `<Suspense>` (or `loading.tsx`) tells Next.js the fallback is a valid shell, which streams instead of blocking ISR for unknown params.
- Layouts may still wrap client hooks such as `usePathname` in `<Suspense>`; that is layout chrome, not page content.

## Metadata conventions

- Static metadata: export `metadata` from `next`.
- Dynamic metadata: export `generateMetadata` and type arguments with generated route props for that route.
- Keep metadata logic close to the route file; avoid cross-file indirection unless reused by multiple routes.
- `generateMetadata` may await `params` on routes that export `generateStaticParams`. Prefer published, cached Storyblok data. `draftMode()` is valid for preview titles.

## use-client decision framework

Default decision: keep `page.tsx` and `layout.tsx` server components.

Add `"use client"` only when at least one is true:

- Uses client hooks (`useState`, `useEffect`, etc.)
- Uses browser-only APIs (`window`, `document`, `localStorage`, etc.)
- Handles events directly in that file

If client behavior is isolated, prefer moving it to a child client component instead of making the entire route entry file client-side.
`_components/render/render.tsx` remains a server component.

## Runtime API conventions with Cache Components

- Await `params` in `page.tsx` or `_components/render/render.tsx` after exporting `generateStaticParams`.
- Do not await `searchParams` for prerendered pages.
- It is valid to `await draftMode()` and branch on `isEnabled` for preview behavior.
- Keep page.tsx focused on `generateStaticParams`, metadata, and composing `<Render />`.
- Prefer relative imports from `./` for route-specific components consumed by `render.tsx`. Cross-route reuse of a shared story renderer is allowed via the `@/` alias.

## Anti-patterns

Do not wrap prerendered page content in `<Suspense>` to satisfy Cache Components.

Forbidden:

```ts
import type { FC } from "react";
import { Suspense } from "react";

const Page: FC<PageProps<"/blog/[slug]">> = ({ params }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Article params={params} />
    </Suspense>
  );
};

export default Page;
```

Correct:

```ts
import type { FC } from "react";

export const generateStaticParams = async () => {
  return [{ slug: "hello-world" }];
};

const Page: FC<PageProps<"/blog/[slug]">> = async ({ params }) => {
  const { slug } = await params;
  return <main>{slug}</main>;
};

export default Page;
```

## Authoring workflow

Copy and follow:

```text
Task Progress:
- [ ] Confirm route path string for generated route props
- [ ] Import explicit React types
- [ ] Implement arrow-function component typed with FC<PageProps<"...">>
- [ ] Export default at bottom of file
- [ ] For dynamic routes, export generateStaticParams with at least one real published path
- [ ] Await params in Page or _components/render/render.tsx (no page-level Suspense)
- [ ] If the page body is non-trivial, colocate _components/render/render.tsx with import "server-only"
- [ ] Colocate route-specific UI used by render.tsx in `_components/<name>/` and helpers in `_helpers/`
- [ ] Do not await searchParams; put pagination/filters in the path when they must be static
- [ ] Add metadata or generateMetadata with route-aware typing when needed
- [ ] Validate server/client boundary
```

## Review checklist

- [ ] Entry component uses `FC<PageProps<"...">>`.
- [ ] Entry component is an arrow function, not a function declaration.
- [ ] Entry component name follows file convention (`Page` for `page.tsx`, `Layout` for `layout.tsx`).
- [ ] Entry component is default-exported at the file bottom.
- [ ] React types are explicitly imported.
- [ ] Dynamic routes export non-empty `generateStaticParams`.
- [ ] Page content is not wrapped in `<Suspense>` or `loading.tsx` solely to read `params`.
- [ ] `_components/render/render.tsx` (when present) includes `import "server-only"`.
- [ ] Route-specific components used by `render.tsx` are colocated in `_components/<name>/` and imported relatively.
- [ ] `searchParams` are not awaited on prerendered pages.
- [ ] Metadata exports are correctly typed and colocated.
- [ ] `"use client"` is only present when required.

## Additional resources

- Examples for static and dynamic routes: [examples.md](examples.md)
