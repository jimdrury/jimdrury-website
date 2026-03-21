# Badge

A neobrutalism-styled inline badge for labelling and status indicators.

## Usage

```tsx
import { Badge } from "@/components/badge";

<Badge variant="info">New</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="warning">Pending</Badge>
```

## Composable examples

```tsx
{/* Inline with text */}
<p>
  Server status: <Badge variant="success">Online</Badge>
</p>

{/* Badge group */}
<div className="flex gap-2">
  <Badge variant="info">React</Badge>
  <Badge variant="info">TypeScript</Badge>
  <Badge variant="warning">Beta</Badge>
</div>
```

## Variants

| Variant   | Color        |
| --------- | ------------ |
| `info`    | Blue (default) |
| `success` | Green        |
| `error`   | Red          |
| `warning` | Yellow       |
