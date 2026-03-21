# Toggle

A neobrutalism-styled toggle switch.

## Import

```tsx
import { Toggle } from "@/forms/toggle";
```

## Usage

```tsx
<Toggle label="Dark mode" id="dark-mode" />
<Toggle label="Notifications" id="notifications" defaultChecked />
```

## Props

Extends `ComponentProps<"input">`.

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Label text next to the toggle |
| `id` | `string` | Links the label to the hidden input |
