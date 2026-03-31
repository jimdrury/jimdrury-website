# BlogCard

A simple link card for blog post previews with neobrutalism styling. Title, date, excerpt, and category label use the shared `Typography` component (Pencil-aligned scale). Renders as an `<article>` with an optional “Read more” link when `href` is set.

## Props

| Prop       | Type        | Default | Description                        |
| ---------- | ----------- | ------- | ---------------------------------- |
| `title`    | `string`    | —       | Post title (required)              |
| `category` | `string`    | —       | Optional pill badge straddling the image bottom-left edge |
| `excerpt`  | `string`    | —       | Short description, clamped to 3 lines |
| `date`     | `string`    | —       | Formatted display date             |
| `dateTime` | `string`    | —       | ISO date for `<time>` element      |
| `href`     | `string`    | —       | Link destination (renders as `<article>` when omitted) |
| `children` | `ReactNode` | —       | Optional custom card content in place of title/excerpt/date layout |

Also accepts standard `<article>` element props via spread.

## Usage

```tsx
import { BlogCard } from "@/components/blog-card";

<BlogCard
  title="Getting Started with Neobrutalism"
  excerpt="Learn how to build bold, retro-inspired interfaces."
  date="April 1, 2025"
  dateTime="2025-04-01"
  href="/blog/neobrutalism"
/>
```

## Minimal

```tsx
<BlogCard title="Untitled Post" />
```
