# Typography

Body and heading text with consistent type scale and weight. Polymorphic: pass `as` to render as any React element (`h1`, `span`, `li`, etc.). Heading tags (`h1`-`h4`) use a fixed style preset for consistency. Extends native `<p>` props for the default element.

## Import

```tsx
import { Typography, typographyVariants } from "@/components/typography";
```

## Usage

```tsx
<Typography>Readable paragraph text</Typography>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `ElementType` | `"p"` | Element or component to render. |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "3xl"` | `"md"` | Tailwind text size classes for non-heading elements. |
| `weight` | `"normal" \| "medium" \| "bold" \| "black"` | `"medium"` | Font weight for non-heading elements. |
| `className` | `string` | — | Merged with typography variants. |
| `children` | `ReactNode` | — | Content. |
| *…rest* | `ComponentProps<"p">` | — | Props forwarded to the rendered element (e.g. `id`, `role` when `as` allows). |

## Variants

**`size`**

- `xs` → `text-xs`
- `sm` → `text-sm`
- `md` → `text-base`
- `lg` → `text-lg`
- `xl` → `text-xl`
- `2xl` → `text-2xl`
- `3xl` → `text-3xl`

**`weight`**

- `normal` → `font-normal`
- `medium` → `font-medium`
- `bold` → `font-bold`
- `black` → `font-black`

Base: `text-black`.

**Heading presets (`as`)**

- `h1` → `size="3xl"` + `weight="black"`
- `h2` → `size="2xl"` + `weight="bold"`
- `h3` → `size="xl"` + `weight="bold"`
- `h4` → `size="lg"` + `weight="medium"`

## Composable examples

**Card title and meta inside `Surface`**

```tsx
import { Surface } from "@/components/surface";
import { Typography } from "@/components/typography";

<Surface padding="md">
  <Typography as="h3" size="xl" weight="bold">
    Release notes
  </Typography>
  <Typography as="p" size="sm" weight="normal" className="mt-2 text-zinc-700">
    Build 2025.03 — polish and fixes.
  </Typography>
</Surface>
```

**List item with `Link`**

```tsx
import { Link } from "@/components/link";
import { Typography } from "@/components/typography";

<li>
  <Typography as="span" size="md">
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
  <Typography as="h1">
    Neobrutalist UI
  </Typography>
  <Typography as="h2" className="mt-4">
    Primitives that slap.
  </Typography>
</section>
```
