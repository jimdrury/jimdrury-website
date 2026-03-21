# Header

A compound site header with dark glassmorphism styling. Semi-transparent black background with backdrop blur, yellow-300 accent text, and drop shadow.

## Sub-components

| Component         | Element        | Description                                                    |
| ----------------- | -------------- | -------------------------------------------------------------- |
| `Header`          | `<header>`     | Outer container with glassmorphism backdrop                    |
| `HeaderLogo`      | `<a>`/`<span>` | Logo wrapper; renders as a link when `href` or `asChild` is provided |
| `HeaderLogoBadge` | `<span>`       | Yellow badge pill for a logo monogram                          |
| `HeaderNav`       | `<nav>`        | Navigation wrapper with a `<ul>`                               |
| `HeaderNavLink`   | `<a>`/`<li>`   | Individual nav link with optional `active` underline state     |

## Usage

```tsx
import { Header, HeaderLogo, HeaderLogoBadge, HeaderNav, HeaderNavLink } from "@/components/header";

<Header>
  <HeaderLogo href="/">
    <HeaderLogoBadge>jd</HeaderLogoBadge>
    <span className="text-base font-semibold">jimdrury</span>
  </HeaderLogo>
  <HeaderNav>
    <HeaderNavLink href="/blog" active>Blog</HeaderNavLink>
    <HeaderNavLink href="/projects">Projects</HeaderNavLink>
    <HeaderNavLink href="/about">About</HeaderNavLink>
  </HeaderNav>
</Header>
```

## With Next.js Link

```tsx
<HeaderNavLink asChild active>
  <Link href="/blog">Blog</Link>
</HeaderNavLink>
```

## Custom styling

All sub-components accept a `className` prop for overrides:

```tsx
<Header className="bg-black/90">
  <HeaderLogo className="gap-3">
    <HeaderLogoBadge>jd</HeaderLogoBadge>
  </HeaderLogo>
</Header>
```
