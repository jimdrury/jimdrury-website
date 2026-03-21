# Checkbox

A neobrutalism-styled checkbox with label.

## Import

```tsx
import { Checkbox } from "@/forms/checkbox";
```

## Usage

```tsx
<Checkbox label="Accept terms" id="terms" />
<Checkbox label="Receive updates" id="updates" defaultChecked />
```

## Props

Extends `ComponentProps<"input">`.

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Label text displayed next to the checkbox |
| `id` | `string` | Links the label to the input |

## Composable example

```tsx
<fieldset>
  <legend className="sr-only">Notifications</legend>
  <div className="flex flex-col items-start gap-3">
    <Checkbox label="Email" id="email" />
    <Checkbox label="SMS" id="sms" />
    <Checkbox label="Push" id="push" />
  </div>
</fieldset>
```
