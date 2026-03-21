# Header

A compound site header with neobrutalism styling. Compose with `HeaderLogo` and `HeaderNav` sub-components.

## Sub-components

| Component   | Element    | Description                          |
| ----------- | ---------- | ------------------------------------ |
| `Header`    | `<header>` | Outer container with bottom border   |
| `HeaderLogo`| `<a>`/`<span>` | Bold logo; renders as a link only when `href` (or `asChild`) is provided |
| `HeaderNav` | `<nav>`    | Navigation wrapper with a `<ul>`     |

## Usage

```tsx
import { Header, HeaderLogo, HeaderNav } from "@/components/header";

<Header>
  <HeaderLogo href="/">Acme Co.</HeaderLogo>
  <HeaderNav>
    <li><a href="/about">About</a></li>
    <li><a href="/blog">Blog</a></li>
    <li><a href="/contact">Contact</a></li>
  </HeaderNav>
</Header>
```

## Logo only

```tsx
<Header>
  <HeaderLogo>My Brand</HeaderLogo>
</Header>
```

## Custom styling

All sub-components accept a `className` prop for overrides:

```tsx
<Header className="bg-yellow-100">
  <HeaderLogo className="text-2xl">Logo</HeaderLogo>
</Header>
```
