# LogoCloud

A simple centered layout for displaying partner or client logos.

## Props

| Prop    | Type     | Default | Description              |
| ------- | -------- | ------- | ------------------------ |
| `title` | `string` | —       | Optional heading text    |

Also accepts all standard `<div>` element props.

## Usage

```tsx
import { LogoCloud } from "@/components/logo-cloud";
import { FaGithub, FaReact, FaAws } from "react-icons/fa";

<LogoCloud title="Trusted by industry leaders">
  <FaGithub className="size-10 text-gray-700" />
  <FaReact className="size-10 text-gray-700" />
  <FaAws className="size-10 text-gray-700" />
</LogoCloud>
```

## Without title

```tsx
<LogoCloud>
  <img src="/logo1.svg" alt="Partner 1" />
  <img src="/logo2.svg" alt="Partner 2" />
</LogoCloud>
```
