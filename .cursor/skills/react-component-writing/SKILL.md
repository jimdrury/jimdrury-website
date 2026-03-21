---
name: react-component-writing
description: Enforces strict React component authoring conventions for this repository, including named exports, FC-typed components, explicit React type imports, deterministic use-client boundaries, and Storyblok blok-to-UI composition rules. Use when creating, refactoring, or reviewing any React component in src/components, src/bloks, or src/app composition layers.
---

# React Component Writing

## Purpose

Apply one canonical style for all React components in this repository.

## Scope

- `src/components`: reusable UI primitives and composites
- `src/bloks`: Storyblok abstraction layer that maps blok data to `src/components`
- `src/app`: composition files that render or wire components together

## Non-negotiable rules

1. Export React components as named exports.
2. Type React components as `FC<Props>`.
3. Never use React global types. Always import React types explicitly.
4. Default to server-safe components. Add `"use client"` only when trigger conditions are met.
5. In `src/bloks`, map typed Storyblok data into `src/components`; avoid duplicating UI markup that already exists as a reusable component.
6. Every file in `src/bloks` must include `import "server-only"` at top-level to enforce server-only execution.

## Authoring workflow

Copy and follow:

```text
Task Progress:
- [ ] Define component role and runtime boundary (server or client)
- [ ] Define Props interface
- [ ] Implement component with FC and named export
- [ ] Apply styling and composition conventions
- [ ] Apply accessibility defaults
- [ ] Validate blok bridge rules (if in src/bloks)
- [ ] Verify barrel/export compatibility
```

## Canonical component pattern

1. Import all React types explicitly:
   - `import type { FC, ReactNode } from "react"`
2. Define `Props` interface above component.
3. Use `export const ComponentName: FC<Props> = (...) => { ... }`.
4. Accept `className` and spread `...props` for reusable UI components.
5. Use `cn()` for class merging.
6. Use `ComponentPropsWithoutChildren<"...">` when extending host element props.

## File and export structure

- Use kebab-case folders for component directories.
- Keep one primary component module per folder: `component-name.tsx`.
- Use folder barrel files: `index.ts` with `export * from "./component-name"`.
- Keep top-level `src/components/index.ts` exports aligned with existing folders only.

## Typing rules

- Required:
  - `FC<Props>` for every React component function.
  - Explicit React type imports in every file that uses React types.
- Forbidden:
  - Unimported/global React types like `ReactNode`, `FC`, `ComponentProps`, `JSX.Element`.
  - Default-exported component functions unless there is a documented exception.

Documented exceptions:

- Next App Router entry files that require framework defaults (`src/app/layout.tsx`, `src/app/page.tsx`).
- Storybook story meta default export (`export default meta` in `*.stories.ts`/`*.stories.tsx`).

Preferred shape:

```ts
import type { FC, ReactNode } from "react";

export interface ExampleProps {
  children?: ReactNode;
}

export const Example: FC<ExampleProps> = ({ children }) => {
  return <div>{children}</div>;
};
```

## Styling and composition rules

- Use `cn()` from `@/lib/utils` to merge `className` with base styles.
- Use `cva()` for multi-variant visual components.
- Prefer `asChild` + `Slot` for polymorphic wrappers where composition matters.
- Keep component APIs small and predictable; avoid boolean-prop explosion.

## Accessibility defaults

- Decorative icons must be wrapped with `aria-hidden`.
- Icon-only controls must preserve an accessible label (`sr-only` or `aria-label`).
- Interactive components must include visible focus treatment (for example `focus-visible:*` classes).
- Use semantic roles only when needed (for example `role="alert"` on alerts).

## use-client decision framework

Default decision: server-safe until proven client-only.

Add `"use client"` only when at least one is true:

- Uses React client hooks (`useState`, `useEffect`, `useReducer`, `useRef`, `useLayoutEffect`, `useTransition`, etc.).
- Uses event handlers in this component file (`onClick`, `onChange`, keyboard/pointer handlers attached here).
- Exposes interactive primitives intended for client-side consumers (for example components that accept DOM event props and are consumed from client components).
- Uses browser-only APIs (`window`, `document`, `localStorage`, `navigator`, `ResizeObserver`, etc.).
- Depends on a client-only provider or runtime behavior.

Keep server-safe when all are true:

- Purely render-time transformation of props/content.
- No client hooks, browser APIs, or local event logic.
- Can render deterministically on the server.

Prohibited mixed patterns:

- Adding `"use client"` preemptively without trigger conditions.
- Pulling browser API reads into otherwise server-safe layout/presentational components.
- Hiding client behavior in utility calls without documenting the boundary.

## Storyblok blok bridge rules

In `src/bloks`, bloks are an abstraction layer:

1. Type the blok shape (`SbBlokData & {...}`) explicitly.
2. Keep Storyblok-specific concerns in bloks (`storyblokEditable`, nested blok rendering).
3. Map blok fields into reusable UI components from `src/components`.
4. Do not re-implement existing UI primitives in blok markup.
5. If a needed UI primitive does not exist, add it in `src/components` first, then consume it in the blok.
6. Add `import "server-only"` in every blok module. Place it before other imports.
7. Never add `"use client"` in blok modules. Bloks may render client components, but the blok module itself remains server-only.

Preferred flow:

```text
Storyblok blok data -> typed blok props -> mapping/adaptation -> src/components composition -> rendered UI
```

## Review checklist

- [ ] Component uses named export and `FC<Props>`.
- [ ] All React types are explicitly imported.
- [ ] `className` + `cn()` + `...props` used appropriately for reusable components.
- [ ] Accessibility defaults are covered.
- [ ] `"use client"` decision matches trigger framework.
- [ ] Blok files bridge data to `src/components` instead of duplicating UI.
- [ ] Every `src/bloks/*` module includes `import "server-only"` and does not declare `"use client"`.
- [ ] Barrel exports remain accurate.

## Additional resources

- Pattern snippets and examples: [examples.md](examples.md)
