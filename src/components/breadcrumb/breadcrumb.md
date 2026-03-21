# Breadcrumb

Composable breadcrumb: a `<nav>` with an ordered list, optional **home** icon link, **slash** separators between crumbs, and `BreadcrumbItem` for each segment.

## Usage

```tsx
import { Breadcrumb, BreadcrumbItem } from "@/components/breadcrumb";

<Breadcrumb homeHref="/">
  <BreadcrumbItem href="/category">Category</BreadcrumbItem>
  <BreadcrumbItem active>Product</BreadcrumbItem>
</Breadcrumb>
```

## Sub-components

### `Breadcrumb`

| Prop        | Type     | Default        | Description                                      |
| ----------- | -------- | -------------- | ------------------------------------------------ |
| `label`     | `string` | `"Breadcrumb"` | Accessible label for the navigation landmark      |
| `homeHref`  | `string` | —              | If set, renders the house icon as a link first |
| `homeLabel` | `string` | `"Home"`       | Accessible name for the home link               |

List styling matches: `flex items-center gap-1 text-sm text-gray-700`.

### `BreadcrumbItem`

| Prop      | Type      | Description                                      |
| --------- | --------- | ------------------------------------------------ |
| `href`    | `string`  | Renders as a link when provided and not active   |
| `active`  | `boolean` | Current page; renders as a `<span>` with `aria-current="page"` |
| `asChild` | `boolean` | Merge link styles onto a child (e.g. `next/link`) |

Place items as direct children of `Breadcrumb`; separators are inserted automatically between them (and after the home icon when `homeHref` is set).
