# Header

A compound site header with brutalist styling. Light background, bold border-bottom, Anton logo, uppercase nav links, and a yellow CTA button with offset shadow.

## Sub-components

| Component       | Element        | Description                                                          |
| --------------- | -------------- | -------------------------------------------------------------------- |
| `Header`        | `<header>`     | Outer sticky container with border-bottom                            |
| `HeaderLogo`    | `<a>`/`<span>` | Logo in Anton font; renders as a link when `href` or `asChild` is provided |
| `HeaderNav`     | `<nav>`        | Navigation wrapper with a `<ul>`                                     |
| `HeaderNavLink` | `<a>`/`<li>`   | Individual nav link — uppercase, bold, with opacity active state     |
| `HeaderCta`     | `<a>`/`<li>`   | Yellow CTA button with brutalist border and offset shadow            |

## Usage

```tsx
import { Header, HeaderLogo, HeaderNav, HeaderNavLink, HeaderCta } from "@/components/header";

<Header>
  <HeaderLogo href="/">JIMDRURY.</HeaderLogo>
  <HeaderNav>
    <HeaderNavLink href="/projects" active>Work</HeaderNavLink>
    <HeaderNavLink href="/about">About</HeaderNavLink>
    <HeaderNavLink href="/blog">Blog</HeaderNavLink>
    <HeaderCta href="/contact">Get in Touch</HeaderCta>
  </HeaderNav>
</Header>
```

## With Next.js Link

```tsx
<HeaderNavLink asChild active>
  <Link href="/projects">Work</Link>
</HeaderNavLink>

<HeaderCta asChild>
  <Link href="/contact">Get in Touch</Link>
</HeaderCta>
```

## Custom styling

All sub-components accept a `className` prop for overrides:

```tsx
<Header className="px-6">
  <HeaderLogo className="text-2xl">JIMDRURY.</HeaderLogo>
</Header>
```
