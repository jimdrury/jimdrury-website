# Card

A compound card component with a neobrutalism aesthetic. Compose with `CardHeader`, `CardBody`, and `CardFooter` sub-components.

## Sub-components

| Component    | Element     | Description                                      |
| ------------ | ----------- | ------------------------------------------------ |
| `Card`       | `<article>` | Outer container with border and shadow            |
| `CardHeader` | `<div>`     | Yellow header strip with bottom border            |
| `CardBody`   | `<div>`     | Main content area with responsive padding         |
| `CardFooter` | `<div>`     | Footer section with top border                    |

## Usage

```tsx
import { Card, CardBody, CardFooter, CardHeader } from "@/components/card";

<Card>
  <CardHeader>
    <strong className="text-xs/none font-bold uppercase">System Message</strong>
  </CardHeader>
  <CardBody>
    <h3 className="text-lg font-semibold">Retro Window</h3>
    <p className="mt-2 text-sm">Card body content goes here.</p>
  </CardBody>
  <CardFooter>
    <p className="text-sm text-gray-700">Footer content</p>
  </CardFooter>
</Card>
```

## Body-only card

```tsx
<Card>
  <CardBody>
    <p>Minimal card with just body content.</p>
  </CardBody>
</Card>
```

## Custom styling

All sub-components accept a `className` prop for overrides:

```tsx
<Card className="bg-pink-50">
  <CardHeader className="bg-pink-300">Custom header</CardHeader>
  <CardBody>Content</CardBody>
</Card>
```
