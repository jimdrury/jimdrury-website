# Button

Primary action control styled to match the Pencil design system (`Component/Button` in `neo_pencil.pen`): 3px `#1a1a1a` border, 6×6px offset shadow, 16×32px padding, 8px gap, 12px radius (`rounded-xl`, matches Pencil `radius-lg`), uppercase-leaning label treatment (`font-extrabold`, `tracking-[1px]`). Uses Radix `Slot` when `asChild` is true so you can render a different element (for example a Next.js link) while keeping button styles.

## Import

```tsx
import { Button, buttonVariants } from "@/components/button";
```

## Usage

```tsx
import { FaSave } from "react-icons/fa";
import { Button } from "@/components/button";

<Button type="submit">Save</Button>

<Button type="button" icon={<FaSave aria-hidden />}>
  Save
</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "tertiary" \| "highlight" \| "dark" \| "ghost"` | `"primary"` | Visual style (see Variants). |
| `asChild` | `boolean` | `false` | Merge props onto the child element via `@radix-ui/react-slot` instead of rendering a `<button>`. |
| `icon` | `ReactNode` | — | Decorative icon (`aria-hidden` wrapper). Ignored when `asChild` — put the icon inside your child. |
| `iconPosition` | `"start" \| "end"` | `"start"` | Only used with `icon` and without `asChild`. |
| `className` | `string` | — | Merged with `buttonVariants` via `cn()`. |
| `children` | `ReactNode` | — | Button content. |
| *…rest* | `ComponentProps<"button">` | — | Native button attributes (`type`, `disabled`, `onClick`, etc.). |

## Variants

- **`primary`** — Fill `#ff6b6b` (coral), dark text.
- **`secondary`** — Fill `#fffdf5` (cream), dark text.
- **`tertiary`** — Fill `#a8d8ea` (blue), dark text.
- **`highlight`** — Fill `#ffe156` (yellow), dark text.
- **`dark`** — Fill `#1a1a1a`, cream text `#fffdf5`.
- **`ghost`** — Transparent fill, no shadow, subtle cream hover.

**Focus** — ring uses cream inner `#fffdf5`, dark outer `#1a1a1a`, and preserves the 6px offset shadow stack (non-ghost).

Base classes (all non-ghost variants): `border-[3px] border-[#1a1a1a] shadow-[6px_6px_0_0_#1a1a1a] gap-2 px-8 py-4 text-base font-extrabold tracking-[1px]`.

## Composable examples

**Card actions inside a `Surface`**

```tsx
import { Button } from "@/components/button";
import { Surface } from "@/components/surface";
import { Typography } from "@/components/typography";

<Surface variant="raised" padding="lg">
  <Typography as="h2" size="xl" weight="bold">
    Confirm subscription
  </Typography>
  <div className="mt-4 flex gap-3">
    <Button variant="ghost" type="button">
      Cancel
    </Button>
    <Button type="submit">Subscribe</Button>
  </div>
</Surface>
```

**Styled anchor with `asChild`**

```tsx
import NextLink from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { Button } from "@/components/button";

<Button asChild variant="primary">
  <NextLink href="/pricing">View pricing</NextLink>
</Button>

{/* Icon with asChild: single child — icon lives inside; merged styles include gap-2 */}
<Button asChild variant="primary">
  <NextLink href="/next">
    Continue
    <FaArrowRight aria-hidden className="size-[1em] shrink-0" />
  </NextLink>
</Button>
```

**Reusing styles without the component**

```tsx
import { buttonVariants } from "@/components/button";
import { cn } from "@/lib/utils";

<button
  type="button"
  className={cn(
    buttonVariants({ variant: "ghost" }),
    "w-full",
  )}
>
  Full width ghost
</button>
```
