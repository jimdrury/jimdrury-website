---
name: nextjs-page-layout-conventions
description: Defines Next.js App Router entry-file conventions for this repository, including FC typing with generated route props, arrow-function component style, default exports, and Cache Components streaming patterns using Suspense with colocated `_components/skeleton.tsx` and `_components/render.tsx`. Use when creating, refactoring, or reviewing route files in `src/app`.
---

# Next.js Page and Layout Conventions

## Purpose

Apply one canonical authoring style for App Router entry files in this repository.

## Scope

- `src/app/**/page.tsx`
- `src/app/**/layout.tsx`
- `src/app/**/template.tsx` (when present)
- metadata exports in those files (`metadata`, `generateMetadata`)
- route-local streaming files in `src/app/**/_components`

## Non-negotiable rules

1. Type route entry components with `FC<...>` using generated route props.
2. Route entry components are arrow-function components.
3. Route entry components are default exports (framework entrypoint exception).
4. React types are explicitly imported from `react`.
5. Keep entry files server-safe by default; add `"use client"` only when required.
6. For routes using runtime APIs under Cache Components, render via `<Suspense>` with a colocated `_components/skeleton.tsx` fallback and `_components/render.tsx` async body.
7. `_components/skeleton.tsx` and `_components/render.tsx` are server components and must include `import "server-only"` at top-level.
8. Route entry component names are fixed by file convention: use `const Page` in `page.tsx` and `const Layout` in `layout.tsx`.
9. Route-specific UI components used by `_components/render.tsx` must be colocated in the same route `_components` folder and imported with relative paths.

## Canonical typing rule

Use generated route prop types as the `FC` generic:

- For a static route like `/blog`: `FC<AppRoutes<"/blog">>`
- For a dynamic route like `/blog/[slug]`: `FC<AppRoutes<"/blog/[slug]">>`

This keeps params and search params aligned with generated Next route typing.

## Canonical component pattern

```ts
import type { FC } from "react";

const Page: FC<AppRoutes<"/blog">> = async () => {
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

## Cache Components composition pattern

When a route needs runtime APIs (`params`, `searchParams`, `draftMode`, `cookies`, `headers`), use this split:

- `page.tsx`: route entry, typed with `FC<AppRoutes<"...">>`, defines `<Suspense>` boundary.
- `_components/skeleton.tsx`: fallback UI component.
- `_components/render.tsx`: async server component that performs runtime awaits.

Required placement:

- `src/app/**/page.tsx`
- `src/app/**/_components/skeleton.tsx`
- `src/app/**/_components/render.tsx`
- Any route-specific UI used by `render.tsx`: `src/app/**/_components/*.tsx`

Rationale:

- Keeps the route shell renderable while dynamic work suspends.
- Aligns with Cache Components expectations for runtime APIs and streaming.
- Keeps each route self-contained and easier to evolve without cross-route coupling.

## Metadata conventions

- Static metadata: export `metadata` from `next`.
- Dynamic metadata: export `generateMetadata` and type arguments with generated route props for that route.
- Keep metadata logic close to the route file; avoid cross-file indirection unless reused by multiple routes.
- If metadata reads runtime APIs or uncached data, keep it intentionally dynamic and follow the same server-only boundary discipline.

## use-client decision framework

Default decision: keep `page.tsx` and `layout.tsx` server components.

Add `"use client"` only when at least one is true:

- Uses client hooks (`useState`, `useEffect`, etc.)
- Uses browser-only APIs (`window`, `document`, `localStorage`, etc.)
- Handles events directly in that file

If client behavior is isolated, prefer moving it to a child client component instead of making the entire route entry file client-side.
For the cache composition pattern above, `_components/skeleton.tsx` and `_components/render.tsx` remain server components.

## Runtime API conventions with Cache Components

- In this repository, pass `params` and `searchParams` from `page.tsx` into `_components/render.tsx`.
- `params` and `searchParams` must be awaited inside `_components/render.tsx`, not in `page.tsx`.
- It is valid to `await draftMode()` and branch on `isEnabled` for preview behavior.
- Keep runtime API awaits in `_components/render.tsx` when possible; keep `page.tsx` focused on route composition and Suspense fallback wiring.
- Prefer relative imports from `./` for route-specific components consumed by `render.tsx`.

## Anti-patterns

Do not await runtime route props in `page.tsx` when using the cache composition pattern.

Forbidden:

```ts
import type { FC } from "react";

const Page: FC<AppRoutes<"/blog/[slug]">> = async ({ params, searchParams }) => {
  const { slug } = await params;
  const query = await searchParams;
  return <main>{slug ?? query?.q}</main>;
};

export default Page;
```

Correct:

```ts
import type { FC } from "react";
import { Suspense } from "react";

import { Render } from "./_components/render";
import { Skeleton } from "./_components/skeleton";

const Page: FC<AppRoutes<"/blog/[slug]">> = ({ params, searchParams }) => {
  return (
    <Suspense fallback={<Skeleton />}>
      <Render params={params} searchParams={searchParams} />
    </Suspense>
  );
};

export default Page;
```

## Authoring workflow

Copy and follow:

```text
Task Progress:
- [ ] Confirm route path string for generated route props
- [ ] Import explicit React types
- [ ] Implement arrow-function component typed with FC<AppRoutes<"...">>
- [ ] Export default at bottom of file
- [ ] If runtime APIs are needed, create `_components/skeleton.tsx` and `_components/render.tsx`
- [ ] Colocate route-specific UI components used by `render.tsx` in the same `_components` folder
- [ ] Add `import "server-only"` to both `_components` files
- [ ] Wrap render component in `<Suspense fallback={<Skeleton />}>` from `page.tsx`
- [ ] Pass `params` and `searchParams` through to `<Render />` without awaiting in `page.tsx`
- [ ] Add metadata or generateMetadata with route-aware typing when needed
- [ ] Validate server/client boundary
```

## Review checklist

- [ ] Entry component uses `FC<AppRoutes<"...">>`.
- [ ] Entry component is an arrow function, not a function declaration.
- [ ] Entry component name follows file convention (`Page` for `page.tsx`, `Layout` for `layout.tsx`).
- [ ] Entry component is default-exported at the file bottom.
- [ ] React types are explicitly imported.
- [ ] Cache Components routes use `<Suspense>` plus colocated `_components/skeleton.tsx` and `_components/render.tsx`.
- [ ] `_components/skeleton.tsx` and `_components/render.tsx` include `import "server-only"`.
- [ ] Route-specific components used by `render.tsx` are colocated in the same `_components` folder and imported relatively.
- [ ] `page.tsx` passes `params` and `searchParams` to `_components/render.tsx` without awaiting.
- [ ] Runtime API awaits (`params`, `searchParams`, `draftMode`) live in the async render component.
- [ ] Metadata exports are correctly typed and colocated.
- [ ] `"use client"` is only present when required.

## Additional resources

- Examples for static and dynamic routes: [examples.md](examples.md)
