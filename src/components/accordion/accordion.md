# Accordion

A composable accordion using native `<details>`/`<summary>` elements with neobrutalism styling.

## Import

```tsx
import { FaQuestionCircle } from "react-icons/fa";
import { Accordion, AccordionItem } from "@/components/accordion";
```

## Usage

```tsx
<Accordion>
  <AccordionItem title="What are the basic features?">
    <p>Content goes here...</p>
  </AccordionItem>
  <AccordionItem title="How do I get started?" icon={FaQuestionCircle}>
    <p>More content...</p>
  </AccordionItem>
</Accordion>
```

### Grouped (single frame)

```tsx
<Accordion grouped>
  <AccordionItem title="First question">…</AccordionItem>
  <AccordionItem title="Second question">…</AccordionItem>
</Accordion>
```

## Sub-components

### Accordion

Container that spaces items vertically.

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | `AccordionItem` elements |
| `grouped` | `boolean` | Optional. One outer border and dividers between items instead of spaced cards |
| `className` | `string` | Additional classes |

### AccordionItem

Individual collapsible panel using native `<details>`.

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Summary text shown in the trigger |
| `open` | `boolean` | Whether the item starts expanded |
| `icon` | `IconType` | Optional. Leading icon **component** before the title (e.g. `FaQuestionCircle`); chevron on the right still shows open/closed |
| `children` | `ReactNode` | Content revealed when expanded |
| `className` | `string` | Additional classes |

## Composable examples

### Default open item

```tsx
<Accordion>
  <AccordionItem title="Open by default" open>
    <p>This content is visible on load.</p>
  </AccordionItem>
</Accordion>
```

### With rich content

```tsx
<Accordion>
  <AccordionItem title="Pricing details">
    <ul className="list-disc pl-4 space-y-1">
      <li>Free tier: 1,000 requests/month</li>
      <li>Pro tier: 100,000 requests/month</li>
      <li>Enterprise: Unlimited</li>
    </ul>
  </AccordionItem>
</Accordion>
```

### Inside a regular section

```tsx
<section className="py-8">
  <h2 className="mb-6 text-center text-3xl font-bold">
    Frequently Asked Questions
  </h2>
  <Accordion>
    <AccordionItem title="How do I cancel?">
      <p>You can cancel anytime from your account settings.</p>
    </AccordionItem>
    <AccordionItem title="Is there a free trial?">
      <p>Yes, 14 days free with no credit card required.</p>
    </AccordionItem>
  </Accordion>
</section>
```
