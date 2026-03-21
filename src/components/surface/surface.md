# Surface

Foundation container for cards, panels, and grouped content: white fill, black border, and optional hard shadows (neobrutalism). Padding is controlled via variants so layouts stay consistent. Use `asChild` to merge surface styles onto a single child (for example a `section` or custom component).

## Import

```tsx
import { Surface, surfaceVariants } from "@/components/surface";
```

## Usage

```tsx
<Surface>Panel content</Surface>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "raised" \| "flat"` | `"default"` | Shadow depth (see Variants). |
| `padding` | `"none" \| "sm" \| "md" \| "lg"` | `"md"` | Inner spacing. |
| `asChild` | `boolean` | `false` | Render as Radix `Slot` wrapping one child. |
| `className` | `string` | — | Merged with surface variants. |
| *…rest* | `ComponentProps<"div">` | — | Native div attributes. |

## Variants

**`variant`**

- **`default`** — `shadow-[4px_4px_0_0_#000]`
- **`raised`** — `shadow-[6px_6px_0_0_#000]`
- **`flat`** — `shadow-none`

**`padding`**

- `none` — `p-0`
- `sm` — `p-3`
- `md` — `p-5`
- `lg` — `p-7`

Base: `border-2 border-black bg-white text-black`.

## Composable examples

**Marketing block with `Typography` and `Button`**

```tsx
import { Button } from "@/components/button";
import { Surface } from "@/components/surface";
import { Typography } from "@/components/typography";

<Surface variant="raised" padding="lg" className="max-w-md">
  <Typography as="h2" size="2xl" weight="bold">
    Join the list
  </Typography>
  <Typography as="p" size="sm" className="mt-2">
    No spam — just updates.
  </Typography>
  <Button className="mt-4 w-full" type="button">
    Sign up
  </Button>
</Surface>
```

**Form field group with `Label`**

```tsx
import { Label } from "@/components/label";
import { Surface } from "@/components/surface";
import { Typography } from "@/components/typography";

<Surface padding="md" variant="flat">
  <Typography as="h3" size="lg" weight="bold" className="mb-4">
    Account
  </Typography>
  <div className="space-y-3">
    <div>
      <Label htmlFor="email" tone="muted">
        Email
      </Label>
      <input id="email" className="mt-1 w-full border-2 border-black px-3 py-2" />
    </div>
  </div>
</Surface>
```

**Semantic wrapper with `asChild`**

```tsx
import { Surface } from "@/components/surface";

<Surface asChild variant="default" padding="none">
  <section className="overflow-hidden">
    {/* padding applied via nested layout if needed */}
  </section>
</Surface>
```
