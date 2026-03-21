# SideMenu

A neobrutalism-styled compound side navigation menu with selectable items.

## Usage

```tsx
import { SideMenu, SideMenuItem } from "@/components/side-menu";

<SideMenu>
  <SideMenuItem href="/dashboard" active>Dashboard</SideMenuItem>
  <SideMenuItem href="/settings">Settings</SideMenuItem>
  <SideMenuItem href="/profile">Profile</SideMenuItem>
</SideMenu>
```

## Props

### SideMenu

Extends `ComponentProps<"nav">`.

### SideMenuItem

| Prop     | Type      | Default | Description                        |
| -------- | --------- | ------- | ---------------------------------- |
| `href`   | `string`  | —       | Link destination (renders `<span>` when omitted) |
| `active` | `boolean` | —       | Highlights the item as active      |
| `asChild` | `boolean` | `false` | Compose a custom link element via Radix `Slot` |

Extends `ComponentProps<"li">`.
