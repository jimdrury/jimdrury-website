# Footer

A compound site footer with neobrutalism styling. Compose with `FooterColumn` sub-components to create a multi-column footer.

## Sub-components

| Component      | Element    | Description                           |
| -------------- | ---------- | ------------------------------------- |
| `Footer`       | `<footer>` | Outer container with top border       |
| `FooterColumn` | `<div>`    | Column with a bold title and link list|

## Props

### FooterColumn

| Prop    | Type     | Default | Description           |
| ------- | -------- | ------- | --------------------- |
| `title` | `string` | —       | Column heading text   |

## Usage

```tsx
import { Footer, FooterColumn } from "@/components/footer";

<Footer>
  <FooterColumn title="Product">
    <li><a href="/features">Features</a></li>
    <li><a href="/pricing">Pricing</a></li>
  </FooterColumn>
  <FooterColumn title="Company">
    <li><a href="/about">About</a></li>
    <li><a href="/careers">Careers</a></li>
  </FooterColumn>
</Footer>
```
