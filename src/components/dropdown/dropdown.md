# Dropdown

A composable dropdown menu built from `Dropdown`, `DropdownTrigger`, `DropdownContent`, and `DropdownItem` sub-components.

## Behavior

- **Open / close**: Trigger toggles the menu. **Click outside** (mousedown) or **Escape** closes it.
- **Focus**: When the menu opens, focus moves to the **first enabled** item. After **Escape**, **item click**, or **Enter** on an item, focus returns to the **trigger**.
- **Keyboard** (while open):
  - **↑ / ↓**: Roving focus between items (skips `disabled` items).
  - **Home / End**: First / last enabled item.
  - **Tab / Shift+Tab**: Cycles focus within the menu (focus trap).
  - **Enter**: Activates the focused item (native button behavior) and closes the menu.
- **ARIA**: Trigger uses `aria-expanded`, `aria-haspopup="menu"`, and `aria-controls`. The panel uses `role="menu"`; items use `role="menuitem"` and roving `tabIndex`.

Place `DropdownItem` components as **direct children** of `DropdownContent` so registration order matches visual order.

## Usage

```tsx
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@/components/dropdown";

<Dropdown>
  <DropdownTrigger>Options</DropdownTrigger>
  <DropdownContent>
    <DropdownItem>Edit</DropdownItem>
    <DropdownItem>Duplicate</DropdownItem>
    <DropdownItem>Delete</DropdownItem>
  </DropdownContent>
</Dropdown>
```

## Sub-components

### `Dropdown`

Root wrapper with open state and outside-click handling. Renders as a relative inline-block container.

### `DropdownTrigger`

Button that toggles the menu. Merges an optional `ref` onto the internal trigger ref used for focus return.

### `DropdownContent`

Absolutely positioned `role="menu"` panel; renders only when open. Handles menu keyboard navigation (bubbled from items).

### `DropdownItem`

`role="menuitem"` button. Runs your `onClick` (if any), then closes the menu and returns focus to the trigger.
