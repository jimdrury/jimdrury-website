# Typography

Body and heading text aligned with TypeSafe AI: **Inter** (`--font-inter`) for `xs`–`lg`, **Geist** (`--font-geist-sans`) for `xl`–`8xl`. Display sizes use medium weight and tight leading. Renders a **`p`** by default, or set **`asChild`** to merge styles onto a single child via Radix `Slot`. Text color uses `--fg-primary` (`#1e1e1e`). Implemented as a client component (`"use client"`) for `Slot`.

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

## Weight per size

| Sizes | Weight |
|-------|--------|
| `xs`, `sm`, `base` | normal |
| `lg`–`8xl` | medium |

## `TYPOGRAPHY_HEADING_PRESETS` (semantic tag → size)

- `h1` → `3xl`
- `h2` → `2xl`
- `h3` → `xl`
- `h4` → `lg`
