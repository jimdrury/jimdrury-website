# Media

An image container with optional caption. Uses semantic `<figure>` and `<figcaption>` elements with neobrutalism styling.

## Usage

```tsx
import { Media } from "@/components/media";

<Media caption="Our latest product launch">
  <img src="/images/hero.jpg" alt="Hero banner" />
</Media>

<Media>
  <img src="/images/photo.jpg" alt="Team photo" />
</Media>
```

## Props

| Prop       | Type        | Description                             |
| ---------- | ----------- | --------------------------------------- |
| `children` | `ReactNode` | Image/content rendered inside `<figure>` |
| `caption`  | `string`    | Optional caption below the image        |
