# BlogCard

A simple link card for blog post previews with neobrutalism styling. Renders as an `<a>` element with hover and focus states.

## Props

| Prop       | Type        | Default | Description                        |
| ---------- | ----------- | ------- | ---------------------------------- |
| `title`    | `string`    | —       | Post title (required)              |
| `category` | `string`    | —       | Optional short label shown over the top-right of the image |
| `excerpt`  | `string`    | —       | Short description, clamped to 2 lines |
| `date`     | `string`    | —       | Formatted display date             |
| `dateTime` | `string`    | —       | ISO date for `<time>` element      |
| `href`     | `string`    | —       | Link destination (renders as `<article>` when omitted) |
| `children` | `ReactNode` | —       | Optional custom card content in place of title/excerpt/date layout |

Also accepts all standard `<a>` element props.

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
