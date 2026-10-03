# Header

A compound site header with TypeSafe styling. White canvas, hairline border-bottom, Geist wordmark, sentence-case nav links, and a pink CTA.

## Sub-components

| Component       | Element        | Description                                                          |
| --------------- | -------------- | -------------------------------------------------------------------- |
| `Header`        | `<header>`     | Outer sticky container with hairline border-bottom                   |
| `HeaderLogo`    | `<a>`/`<span>` | Logo in Geist; renders as a link when `href` or `asChild` is provided |
| `HeaderNav`     | `<nav>`        | Navigation wrapper with a `<ul>`                                     |
| `HeaderNavLink` | `<a>`/`<li>`   | Individual nav link — medium weight, opacity active state            |
| `HeaderCta`     | `<a>`/`<li>`   | Pink CTA button                                                      |

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
