# SkipLink

An accessibility skip-navigation link that becomes visible on focus, allowing keyboard users to bypass navigation.

## Usage

```tsx
import { SkipLink } from "@/components/skip-link";

<SkipLink href="#main">Skip to main content</SkipLink>
<SkipLink href="#content">Jump to content</SkipLink>
```

## Props

| Prop       | Type        | Default                  | Description              |
| ---------- | ----------- | ------------------------ | ------------------------ |
| `href`     | `string`    | —                        | Target anchor (renders `<span>` when omitted) |
| `children` | `ReactNode` | —                        | Link text                |

Extends `ComponentProps<"a">`.
