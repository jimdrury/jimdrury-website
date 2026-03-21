# Input

A neobrutalism-styled text input with optional label.

## Import

```tsx
import { Input } from "@/forms/input";
```

## Usage

```tsx
<Input label="Email" type="email" id="email" />
<Input label="Search" type="search" id="search" placeholder="Search..." />
<Input label="Password" type="password" id="password" />
```

## Props

Extends `ComponentProps<"input">`.

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Optional label text displayed above the input |
| `id` | `string` | Links the label to the input |

## Composable example

```tsx
<form className="flex flex-col gap-4">
  <Input label="Full name" id="name" />
  <Input label="Email" type="email" id="email" placeholder="you@example.com" />
  <Button type="submit">Submit</Button>
</form>
```
