# Divider

A neobrutalism-styled horizontal rule, optionally with a centered text label.

## Usage

```tsx
import { Divider } from "@/components/divider";

<Divider />
<Divider label="OR" />
```

## Props

| Prop    | Type     | Default | Description                |
| ------- | -------- | ------- | -------------------------- |
| `label` | `string` | —       | Centered text on the rule  |

Extends `ComponentProps<"hr">`.
