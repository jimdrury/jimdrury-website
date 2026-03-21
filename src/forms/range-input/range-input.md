# RangeInput

A neobrutalism-styled range slider input.

## Import

```tsx
import { RangeInput } from "@/forms/range-input";
```

## Usage

```tsx
<RangeInput label="Volume" id="volume" />
<RangeInput label="Brightness" id="brightness" min={0} max={100} defaultValue={50} />
```

## Props

Extends `ComponentProps<"input">`.

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Optional label text above the slider |
| `id` | `string` | Links the label to the input |
