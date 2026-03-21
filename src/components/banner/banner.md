# Banner

A dismissable banner with neobrutalism styling. Client component with a yellow background and optional dismiss callback.

## Props

| Prop        | Type         | Default | Description                        |
| ----------- | ------------ | ------- | ---------------------------------- |
| `onDismiss` | `() => void` | —       | Shows dismiss button when provided |
| `dismissLabel` | `string`  | `"Dismiss"` | Accessible label for the dismiss button |
| `children`  | `ReactNode`  | —       | Banner message content             |

Also accepts all standard `<div>` element props.

## Usage

```tsx
import { Banner } from "@/components/banner";

<Banner>New feature available! Check out the latest updates.</Banner>
```

## Dismissable

```tsx
<Banner onDismiss={() => setVisible(false)}>
  This banner can be dismissed.
</Banner>
```

## Custom styling

```tsx
<Banner className="bg-pink-300">A custom-styled banner.</Banner>
```
