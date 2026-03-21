# RadioGroup

A neobrutalism-styled radio group using a compound component pattern.

## Import

```tsx
import { RadioGroup, RadioOption } from "@/forms/radio-group";
```

## Usage

```tsx
<RadioGroup legend="Favourite colour">
  <RadioOption label="Red" id="red" name="colour" value="red" />
  <RadioOption label="Green" id="green" name="colour" value="green" />
  <RadioOption label="Blue" id="blue" name="colour" value="blue" />
</RadioGroup>
```

## Props

### RadioGroup

Extends `ComponentProps<"fieldset">`.

| Prop | Type | Description |
|------|------|-------------|
| `legend` | `string` | Visually hidden legend for accessibility |

### RadioOption

Extends `ComponentProps<"input">`.

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Label text next to the radio button |
| `id` | `string` | Links the label to the input |
| `name` | `string` | Groups radio options together |
| `value` | `string` | Value of the option |
