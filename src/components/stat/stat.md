# Stat

A neobrutalism-styled stat card for displaying key metrics with optional trend indicators.

## Usage

```tsx
import { Stat } from "@/components/stat";

<Stat label="Total Users" value="12,340" />
<Stat label="Revenue" value="$48,200" change="12% from last month" trend="up" />
<Stat label="Bounce Rate" value="42%" change="3% from last week" trend="down" />
```

## Grid layout example

```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
  <Stat label="Users" value="12,340" />
  <Stat label="Revenue" value="$48,200" change="12%" trend="up" />
  <Stat label="Orders" value="890" change="3%" trend="down" />
</div>
```

## Props

| Prop     | Type                 | Description                      |
| -------- | -------------------- | -------------------------------- |
| `value`  | `ReactNode`          | The primary metric value         |
| `label`  | `string`             | Description label above value    |
| `change` | `string` (optional)  | Change description text          |
| `trend`  | `"up" \| "down"` (optional) | Trend direction for coloring |
| `trendUpSymbol` | `ReactNode` (optional) | Symbol/content shown for upward trend |
| `trendDownSymbol` | `ReactNode` (optional) | Symbol/content shown for downward trend |
| `trendClassName` | `string` (optional) | Additional class merged into trend text |
| `trendUpClassName` | `string` (optional) | Override class for upward trend |
| `trendDownClassName` | `string` (optional) | Override class for downward trend |
| `trendNeutralClassName` | `string` (optional) | Override class when no trend is set |
