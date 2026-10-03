# Button

Primary action control styled to match TypeSafe AI: 1px hairline border, square corners, medium Geist label, no offset shadow. Uses Radix `Slot` when `asChild` is true so you can render a different element (for example a Next.js link) while keeping button styles.

## Import

```tsx
import { Button, buttonVariants } from "@/components/button";
```

## Usage

```tsx
<Button type="submit">Save</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "tertiary" \| "highlight" \| "dark" \| "ghost"` | `"primary"` | Visual style (see Variants). |
| `asChild` | `boolean` | `false` | Merge props onto the child element via `@radix-ui/react-slot` instead of rendering a `<button>`. |
| `className` | `string` | — | Merged with `buttonVariants` via `cn()`. |
| `children` | `ReactNode` | — | Button content. |
| *…rest* | `ComponentProps<"button">` | — | Native button attributes (`type`, `disabled`, `onClick`, etc.). |

## Variants

- **`primary`** — Fill `#f386a1` (pink), dark text.
- **`secondary`** — Canvas fill, hairline border.
- **`tertiary`** — Fill `#09aea1` (teal), dark text.
- **`highlight`** — Fill `#f386a1` (pink accent), dark text.
- **`dark`** — Fill `#1e1e1e`, inverse text.
- **`ghost`** — Transparent fill, hover grey.

**Focus** — pink ring on canvas.
