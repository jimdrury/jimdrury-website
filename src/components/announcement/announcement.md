# Announcement

A top-bar announcement banner with neobrutalism styling. Supports `asChild` for rendering as a link or any interactive element.

## Import

```tsx
import { Announcement } from "@/components/announcement";
```

## Usage

```tsx
<Announcement>We just launched our new feature!</Announcement>
```

## Props

Extends `ComponentProps<"div">`.

| Prop | Type | Description |
|------|------|-------------|
| `asChild` | `boolean` | Render as child element instead of `<div>` |
| `children` | `ReactNode` | Announcement content |

## Composable examples

### As a link

```tsx
<Announcement asChild>
  <a href="/changelog">Version 2.0 is here — read the changelog</a>
</Announcement>
```

### With Next.js Link

```tsx
<Announcement asChild>
  <Link href="/changelog">Version 2.0 is here — read the changelog</Link>
</Announcement>
```

### Static (no link)

```tsx
<Announcement>Scheduled maintenance on Sunday at 2am UTC</Announcement>
```
