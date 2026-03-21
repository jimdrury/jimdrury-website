# Modal

A compound dialog component built on the native `<dialog>` element with neobrutalism styling.

## Sub-components

### Modal

The root wrapper. Controls open/close state via the `open` prop.

| Prop      | Type         | Description                          |
| --------- | ------------ | ------------------------------------ |
| `open`    | `boolean`    | Whether the modal is visible         |
| `onClose` | `() => void` | Callback when the dialog is closed   |

### ModalHeader

The header bar with a title and optional close button.

| Prop      | Type         | Description                        |
| --------- | ------------ | ---------------------------------- |
| `onClose` | `() => void` | Shows a close icon when provided   |
| `closeLabel` | `string` | Accessible label for the close button (`"Close"` by default) |

### ModalBody

Content area with responsive padding.

### ModalFooter

Footer area for action buttons, right-aligned with a top border.

## Usage

```tsx
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/modal";

<Modal open={isOpen} onClose={() => setIsOpen(false)}>
  <ModalHeader onClose={() => setIsOpen(false)}>Title</ModalHeader>
  <ModalBody>Content goes here</ModalBody>
  <ModalFooter>
    <button type="button" onClick={() => setIsOpen(false)}>Cancel</button>
    <button type="button" onClick={handleConfirm}>Confirm</button>
  </ModalFooter>
</Modal>
```
