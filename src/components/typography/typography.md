# Typography

Body and heading text aligned with Pencil (`neo_pencil.pen`): `typo-size`, `typo-leading`, `typo-tracking`, `typo-font`, and **`typo-weight` fixed per size step**. **Inter** (`--font-inter`) for `xs`–`2xl`, **Anton** (`--font-anton`) for `3xl`–`8xl`. Renders a **`p`** by default, or set **`asChild`** to merge styles onto a single child via Radix `Slot` (e.g. `<Typography asChild size="3xl"><h1>…</h1></Typography>`). Text color matches Pencil `fg-primary` (`#1a1a1a`). Implemented as a client component (`"use client"`) for `Slot`.

Export **`TYPOGRAPHY_HEADING_PRESETS`** maps `h1`–`h4` → `{ size }` for Storyblok-style semantic headings (weight follows that size).

## Import

```tsx
import {
  Typography,
  typographyVariants,
  TYPOGRAPHY_HEADING_PRESETS,
} from "@/components/typography";
```

## Usage

```tsx
<Typography>Readable paragraph text</Typography>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Merge typography classes onto the single child (`Slot`). |
| `size` | `"xs"` … `"8xl"` | `"md"` | Type scale step; **weight is determined by this step only**. |
| `uppercase` | `boolean` | `false` | Applies `uppercase` (all-caps styling). |
| `children` | `ReactNode` | — | Content. |
| *…rest* | `ComponentProps<"p">` (no `className`) | — | Props forwarded to the rendered element. **`className` is not supported** — wrap with a parent or put layout classes on the child when using `asChild`. |

## Weight per size (Pencil `typo-weight`)

| Sizes | Weight |
|-------|--------|
| `xs`, `sm`, `md` | normal |
| `lg` | medium |
| `xl` | semibold |
| `2xl`–`4xl` | bold |
| `5xl`–`6xl` | extrabold |
| `7xl`–`8xl` | black |

## `TYPOGRAPHY_HEADING_PRESETS` (semantic tag → size)

- `h1` → `3xl`
- `h2` → `2xl`
- `h3` → `xl`
- `h4` → `lg`

## Composable examples

**Card title and meta inside `Surface`**

```tsx
import { Surface } from "@/components/surface";
import { Typography } from "@/components/typography";

<Surface padding="md">
  <Typography asChild size="xl">
    <h3>Release notes</h3>
  </Typography>
  <div className="mt-2 text-zinc-700">
    <Typography size="sm">Build 2025.03 — polish and fixes.</Typography>
  </div>
</Surface>
```

**List item with `Link`**

```tsx
import { Link } from "@/components/link";
import { Typography } from "@/components/typography";

<li>
  <Typography>
    Read the docs:{" "}
    <Link href="/docs" variant="subtle">
      getting started
    </Link>
  </Typography>
</li>
```

**Semantic heading stack**

```tsx
import { Typography } from "@/components/typography";

<section>
  <Typography asChild size="3xl">
    <h1>Neobrutalist UI</h1>
  </Typography>
  <div className="mt-4">
    <Typography asChild size="2xl">
      <h2>Primitives that slap.</h2>
    </Typography>
  </div>
</section>
```

**`asChild` with a link**

```tsx
import Link from "next/link";
import { Typography } from "@/components/typography";

<Typography asChild size="lg">
  <Link href="/blog">Blog</Link>
</Typography>
```
