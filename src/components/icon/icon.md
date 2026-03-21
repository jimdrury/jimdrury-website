# Icon

Wraps any icon child (for example from `react-icons`) in a flex-centered `span` with consistent square dimensions. The wrapper sets `aria-hidden="true"` by default, so pair icons with visible text or use them inside controls that expose an accessible name (e.g. `IconButton` with `label`).

## Import

```tsx
import { Icon, iconVariants } from "@/components/icon";
```

## Usage

```tsx
import { FaHeart } from "react-icons/fa";

<Icon size="md">
  <FaHeart />
</Icon>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Wrapper box: `size-4` / `size-5` / `size-6`. |
| `className` | `string` | — | Merged with icon variants. |
| `children` | `ReactNode` | — | Icon element(s) to size and align. |
| *…rest* | `ComponentProps<"span">` | — | Additional span props (avoid overriding `aria-hidden` without an alternative for a11y). |

## Variants

**`size`**

- **`sm`** — `size-4` (1rem)
- **`md`** — `size-5` (1.25rem)
- **`lg`** — `size-6` (1.5rem)

Base: `inline-flex shrink-0 items-center justify-center`.

## Composable examples

**`Button` with leading icon**

```tsx
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { FaCheck } from "react-icons/fa";

<Button type="button">
  <Icon size="sm" className="mr-2">
    <FaCheck />
  </Icon>
  Confirm
</Button>
```

**`Link` with trailing icon**

```tsx
import { Icon } from "@/components/icon";
import { Link } from "@/components/link";
import { FaExternalLinkAlt } from "react-icons/fa";

<Link href="https://example.com" variant="default" className="inline-flex items-center gap-1">
  Open site
  <Icon size="sm">
    <FaExternalLinkAlt />
  </Icon>
</Link>
```

**Inline with `Typography`**

```tsx
import { Icon } from "@/components/icon";
import { Typography } from "@/components/typography";
import { FaStar } from "react-icons/fa";

<Typography as="p" size="sm" className="inline-flex items-center gap-2">
  <Icon size="sm">
    <FaStar />
  </Icon>
  Featured pick
</Typography>
```
