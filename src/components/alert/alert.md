# Alert

A compound alert with variant tints, neobrutalism styling, and dark neutral text. Compose with `AlertIcon`, `AlertBody`, `AlertTitle`, and `AlertDescription`.

## Layout modes

- **Title only** — `AlertBody` with `AlertTitle`
- **Content only** — `AlertBody` with `AlertDescription`
- **Title + content** — `AlertBody` with both, stacked with spacing

Use `AlertBody` as the text column whenever you have an `AlertIcon` so the row lays out correctly (`flex-1`, wrapping).

## Sub-components

| Component          | Element  | Description                              |
| ------------------ | -------- | ---------------------------------------- |
| `Alert`            | `<div>`  | Outer container with `role="alert"`      |
| `AlertIcon`        | `<span>` | Icon slot (accepts any icon element)     |
| `AlertBody`        | `<div>`  | Text column: stacks title/description    |
| `AlertTitle`       | `<p>`    | Short heading line                       |
| `AlertDescription` | `<p>`    | Body / supporting copy                   |

## Variants

- `info` (default) — blue background
- `success` — green background
- `error` — red background
- `warning` — yellow background

## Usage

```tsx
import { FaInfoCircle } from "react-icons/fa";
import {
  Alert,
  AlertBody,
  AlertDescription,
  AlertIcon,
} from "@/components/alert";

<Alert variant="info">
  <AlertIcon>
    <FaInfoCircle className="size-5" />
  </AlertIcon>
  <AlertBody>
    <AlertDescription>This is an informational message.</AlertDescription>
  </AlertBody>
</Alert>
```

## Title + content

```tsx
import {
  Alert,
  AlertBody,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/components/alert";

<Alert variant="warning">
  <AlertIcon>{/* icon */}</AlertIcon>
  <AlertBody>
    <AlertTitle>Review required</AlertTitle>
    <AlertDescription>Fix the issues below before continuing.</AlertDescription>
  </AlertBody>
</Alert>
```

## Without icon

```tsx
<Alert variant="success">
  <AlertBody>
    <AlertDescription>Operation completed.</AlertDescription>
  </AlertBody>
</Alert>
```
