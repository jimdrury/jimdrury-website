# FeatureGrid

A compound grid layout for feature cards with neobrutalism styling. Compose with `Feature` sub-components.

## Sub-components

| Component     | Element  | Description                                |
| ------------- | -------- | ------------------------------------------ |
| `FeatureGrid` | `<div>`  | Responsive grid container (1–3 columns)    |
| `Feature`     | `<div>`  | Feature card with icon, title, and content |

## Props

### Feature

| Prop    | Type        | Default | Description                  |
| ------- | ----------- | ------- | ---------------------------- |
| `icon`  | `ReactNode` | —       | Icon element displayed above |
| `title` | `string`    | —       | Feature heading (required)   |

## Usage

```tsx
import { FeatureGrid, Feature } from "@/components/feature-grid";
import { FaRocket, FaBolt, FaLock } from "react-icons/fa";

<FeatureGrid>
  <Feature icon={<FaRocket />} title="Fast">
    Lightning-fast performance out of the box.
  </Feature>
  <Feature icon={<FaBolt />} title="Powerful">
    Built with modern tools and best practices.
  </Feature>
  <Feature icon={<FaLock />} title="Secure">
    Enterprise-grade security baked in.
  </Feature>
</FeatureGrid>
```
