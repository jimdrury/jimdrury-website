# Toast

A dismissable notification toast with variant colors and neobrutalism styling. Client component with optional dismiss callback.

## Props

| Prop        | Type         | Default  | Description                        |
| ----------- | ------------ | -------- | ---------------------------------- |
| `variant`   | `"info" \| "success" \| "error"` | `"info"` | Color variant |
| `onDismiss` | `() => void` | —        | Shows dismiss button when provided |
| `dismissLabel` | `string`  | `"Dismiss"` | Accessible label for the dismiss button |
| `variantClassName` | `string` | —     | Extra class hooks to override semantic variant styling |
| `children`  | `ReactNode`  | —        | Toast message content              |

Also accepts all standard `<div>` element props.

## Usage

```tsx
import { Toast } from "@/components/toast";

<Toast variant="success">Changes saved successfully.</Toast>
```

## Hook-driven toasts

```tsx
import { Button, Toast, useToast } from "@/components";

const { toasts, toast, dismiss } = useToast();

<Button
  type="button"
  onClick={() => toast({ message: "Saved", variant: "success" })}
>
  Trigger Toast
</Button>;

<div className="fixed bottom-4 right-4 flex max-w-sm flex-col gap-2">
  {toasts.map((item) => (
    <Toast
      key={item.id}
      variant={item.variant}
      onDismiss={() => dismiss(item.id)}
    >
      {item.message}
    </Toast>
  ))}
</div>;
```

## Dismissable

```tsx
<Toast variant="error" onDismiss={() => setVisible(false)}>
  Failed to save changes.
</Toast>
```

## Static (no dismiss)

```tsx
<Toast variant="info">Processing your request...</Toast>
```
