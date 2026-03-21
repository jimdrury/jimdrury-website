# Button

Primary action control with neobrutalist styling: thick black border, hard offset shadow, and a yellow hover fill on the default variant. Uses Radix `Slot` when `asChild` is true so you can render a different element (for example a Next.js link) while keeping button styles.

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
| `variant` | `"default" \| "ghost"` | `"default"` | Visual style (see Variants). |
| `asChild` | `boolean` | `false` | Merge props onto the child element via `@radix-ui/react-slot` instead of rendering a `<button>`. |
| `icon` | `ReactNode` | — | Decorative icon (`aria-hidden` wrapper). Ignored when `asChild` — put the icon inside your child. |
| `iconPosition` | `"start" \| "end"` | `"start"` | Only used with `icon` and without `asChild`. |
| `className` | `string` | — | Merged with `buttonVariants` via `cn()`. |
| `children` | `ReactNode` | — | Button content. |
| *…rest* | `ComponentProps<"button">` | — | Native button attributes (`type`, `disabled`, `onClick`, etc.). |

## Variants

- **`default`** — White background, black `border-2`, `shadow-[4px_4px_0_0]`, `hover:bg-yellow-300`.
- **`ghost`** — Transparent background, no shadow, `hover:bg-yellow-100`.

**Focus** — pure Tailwind utilities on the component: `focus-visible:outline-2 focus-visible:outline-transparent focus-visible:outline-offset-[4px] focus-visible:shadow-[0_0_0_2px_#fde047,0_0_0_4px_#000,4px_4px_0_4px_#000]`.

Base classes (all variants): `inline-flex items-center justify-center gap-2 border-2 border-black px-5 py-3 font-semibold text-black … transition`.

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

<Button asChild variant="default">
  <NextLink href="/pricing">View pricing</NextLink>
</Button>

{/* Icon with asChild: single child — icon lives inside; merged styles include gap-2 */}
<Button asChild variant="default">
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
