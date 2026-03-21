# IconButton

Square icon-only control with neobrutalist border and shadow (on solid/outlined). Supports multiple visual variants and sizes. When no `children` are passed, a default `FaPlus` icon from `react-icons/fa` is shown (or `defaultIcon` when provided). Set `label` for an accessible name when the icon is not accompanied by visible text.

## Import

```tsx
import { IconButton, iconButtonVariants } from "@/components/icon-button";
```

## Usage

```tsx
<IconButton label="Add item" type="button" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"solid" \| "outlined" \| "ghost"` | `"solid"` | Fill and shadow treatment (see Variants). |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Fixed square dimensions (`size-8` / `10` / `12`). |
| `asChild` | `boolean` | `false` | Use Radix `Slot` to style a child element as the button. |
| `label` | `string` | — | Passed to `aria-label` for screen readers. |
| `defaultIcon` | `ReactNode` | `<FaPlus />` | Custom fallback icon when `children` is omitted. |
| `className` | `string` | — | Merged with variant classes. |
| `children` | `ReactNode` | `<FaPlus />` | Custom icon node; default plus uses `aria-hidden`. |
| *…rest* | `ComponentProps<"button">` | — | Native button props. |

## Variants

**`variant`**

- **`solid`** — `bg-yellow-300`, black offset shadow; on hover, slight translate and shadow removed.
- **`outlined`** — White background with the same shadow/hover motion as solid.
- **`ghost`** — Transparent border, no shadow; `hover:bg-zinc-100`.

**`size`**

- `sm` — `size-8`
- `md` — `size-10`
- `lg` — `size-12`

## Composable examples

**Toolbar with `Icon` sizing**

```tsx
import { Icon } from "@/components/icon";
import { IconButton } from "@/components/icon-button";
import { FaTrash } from "react-icons/fa";

<div className="flex gap-2">
  <IconButton label="Delete" variant="outlined" size="sm" type="button">
    <Icon size="sm">
      <FaTrash />
    </Icon>
  </IconButton>
</div>
```

**Header actions on a `Surface`**

```tsx
import { IconButton } from "@/components/icon-button";
import { Surface } from "@/components/surface";
import { Typography } from "@/components/typography";
import { FaBars } from "react-icons/fa";

<Surface padding="sm" className="flex items-center justify-between">
  <Typography as="span" weight="bold" size="lg">
    Dashboard
  </Typography>
  <IconButton label="Open menu" variant="ghost" type="button">
    <FaBars className="size-4" aria-hidden />
  </IconButton>
</Surface>
```

**Next.js route as the clickable target**

```tsx
import NextLink from "next/link";
import { IconButton } from "@/components/icon-button";
import { FaArrowRight } from "react-icons/fa";

<IconButton asChild label="Continue">
  <NextLink href="/next-step">
    <FaArrowRight className="size-4" aria-hidden />
  </NextLink>
</IconButton>
```
