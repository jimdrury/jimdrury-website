# VerticalMenu

A neobrutalism-styled compound vertical navigation menu with spaced items.

## Usage

```tsx
import { VerticalMenu, VerticalMenuItem } from "@/components/vertical-menu";

<VerticalMenu>
  <VerticalMenuItem href="/home" active>Home</VerticalMenuItem>
  <VerticalMenuItem href="/about">About</VerticalMenuItem>
  <VerticalMenuItem href="/services">Services</VerticalMenuItem>
</VerticalMenu>
```

## Props

### VerticalMenu

Extends `ComponentProps<"nav">`.

### VerticalMenuItem

| Prop     | Type      | Default | Description                        |
| -------- | --------- | ------- | ---------------------------------- |
| `href`   | `string`  | —       | Link destination (renders `<span>` when omitted) |
| `active` | `boolean` | —       | Highlights the item as active      |
| `asChild` | `boolean` | `false` | Compose a custom link element via Radix `Slot` |

Extends `ComponentProps<"li">`.
