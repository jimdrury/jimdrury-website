# QuantityInput

A neobrutalism-styled quantity stepper with increment/decrement buttons.

## Import

```tsx
import { QuantityInput } from "@/forms/quantity-input";
```

## Usage

```tsx
const [qty, setQty] = useState(1);
<QuantityInput value={qty} onChange={setQty} min={0} max={10} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | — | Current quantity value |
| `onChange` | `(value: number) => void` | — | Called when the value changes |
| `min` | `number` | `0` | Minimum allowed value |
| `max` | `number` | `99` | Maximum allowed value |
| `className` | `string` | — | Additional CSS classes |
