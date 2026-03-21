# Label

Form label styling: small, bold, uppercase, wide tracking. Use with `htmlFor` pointing at an input `id`. The `muted` tone uses zinc text for secondary fields.

## Import

```tsx
import { Label, labelVariants } from "@/components/label";
```

## Usage

```tsx
<Label htmlFor="name">Full name</Label>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tone` | `"default" \| "muted"` | `"default"` | Text color (see Variants). |
| `className` | `string` | — | Merged with label variants. |
| `children` | `ReactNode` | — | Visible label text. |
| `htmlFor` | `string` | — | Associates label with a control (`for` attribute). |
| *…rest* | `ComponentProps<"label">` | — | Other native label attributes. |

## Variants

- **`default`** — `text-black`
- **`muted`** — `text-zinc-700`

Base: `block text-sm font-bold uppercase tracking-wide`.

## Composable examples

**Stacked field with `Surface`**

```tsx
import { Label } from "@/components/label";
import { Surface } from "@/components/surface";

<Surface padding="md" variant="flat">
  <Label htmlFor="email-signup">Email address</Label>
  <input
    id="email-signup"
    type="email"
    className="mt-1 w-full border-2 border-black px-3 py-2"
  />
</Surface>
```

**Optional field with muted tone and helper `Typography`**

```tsx
import { Label } from "@/components/label";
import { Typography } from "@/components/typography";

<div>
  <Label htmlFor="company" tone="muted">
    Company <Typography as="span" size="xs" weight="normal">(optional)</Typography>
  </Label>
  <input id="company" className="mt-1 w-full border-2 border-black px-3 py-2" />
</div>
```

**Submit row with `Button`**

```tsx
import { Button } from "@/components/button";
import { Label } from "@/components/label";

<form className="space-y-4">
  <div>
    <Label htmlFor="message">Message</Label>
    <textarea id="message" className="mt-1 w-full border-2 border-black p-3" rows={4} />
  </div>
  <Button type="submit">Send</Button>
</form>
```
