# Media

An image container with optional caption. Uses semantic `<figure>` and `<figcaption>` elements with neobrutalism styling.

## Usage

```tsx
import { Media } from "@/components/media";

<Media
  src="/images/hero.jpg"
  alt="Hero banner"
  caption="Our latest product launch"
/>

<Media src="/images/photo.jpg" alt="Team photo" />
```

## Props

| Prop      | Type     | Description                         |
| --------- | -------- | ----------------------------------- |
| `src`     | `string` | Image source URL (required)         |
| `alt`     | `string` | Alt text for accessibility (required) |
| `caption` | `string` | Optional caption below the image    |
