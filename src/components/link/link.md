# Link

Bold text link with underline treatment controlled by variant. Uses Radix `Slot` when `asChild` is true so you can compose with Next.js `<Link>` (or other components) while keeping the same styles.

## Import

```tsx
import { Link, linkVariants } from "@/components/link";
```

## Usage

```tsx
import { FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "@/components/link";

<Link href="/about">About</Link>

<Link href="/docs" icon={<FaExternalLinkAlt aria-hidden />}>
  Documentation
</Link>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "subtle"` | `"default"` | Underline and color behavior (see Variants). |
| `asChild` | `boolean` | `false` | Merge onto child via `Slot` instead of rendering `<a>`. |
| `icon` | `ReactNode` | — | Decorative icon before/after the label (`aria-hidden` wrapper). Ignored when `asChild` is true — put the icon inside your child. |
| `iconPosition` | `"start" \| "end"` | `"start"` | Only used with `icon` and without `asChild`. |
| `className` | `string` | — | Merged with link variants. |
| `children` | `ReactNode` | — | Link text or content. |
| *…rest* | `ComponentProps<"a">` | — | Native anchor attributes (`href`, `target`, `rel`, etc.). |

## Variants

- **`default`** — Black text, underline, `hover:text-zinc-700`; `underline-offset-4` and `transition-colors` on the base.
- **`subtle`** — Zinc text, no underline in styles; `hover:text-black` (still bold via base).

Base: `font-bold underline-offset-4 transition-colors`.

## Composable examples

**Next.js client navigation**

```tsx
import NextLink from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "@/components/link";

<Link asChild variant="default">
  <NextLink href="/blog">Blog</NextLink>
</Link>

{/* Icon with asChild: keep a single child; put the icon inside NextLink */}
<Link asChild variant="default">
  <NextLink href="/next" className="inline-flex items-center gap-2">
    Next
    <FaArrowRight aria-hidden className="size-[1em] shrink-0" />
  </NextLink>
</Link>
```

**Inside a `Surface` promo**

```tsx
import { Link } from "@/components/link";
import { Surface } from "@/components/surface";
import { Typography } from "@/components/typography";

<Surface padding="md">
  <Typography as="p" size="md">
    New post:{" "}
    <Link href="/posts/neobrutalism" variant="subtle">
      Designing with hard shadows
    </Link>
  </Typography>
</Surface>
```

**Footer row with `Typography`**

```tsx
import { Link } from "@/components/link";
import { Typography } from "@/components/typography";

<nav className="flex gap-4">
  <Typography as="span" size="sm" weight="normal">
    <Link href="/privacy">Privacy</Link>
  </Typography>
  <Typography as="span" size="sm" weight="normal">
    <Link href="/terms" variant="subtle">
      Terms
    </Link>
  </Typography>
</nav>
```
