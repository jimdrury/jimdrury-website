# Tabs

A composable tab interface built from `Tabs`, `TabList`, `TabTrigger`, and `TabContent` sub-components. Uses React Context for state management.

## Usage

```tsx
import { Tabs, TabList, TabTrigger, TabContent } from "@/components/tab";

<Tabs defaultIndex={0}>
  <TabList>
    <TabTrigger index={0}>Profile</TabTrigger>
    <TabTrigger index={1}>Account</TabTrigger>
    <TabTrigger index={2}>Settings</TabTrigger>
  </TabList>
  <TabContent index={0}>
    <p>Profile content</p>
  </TabContent>
  <TabContent index={1}>
    <p>Account content</p>
  </TabContent>
  <TabContent index={2}>
    <p>Settings content</p>
  </TabContent>
</Tabs>
```

## Sub-components

### `Tabs`

Root wrapper that provides tab state via context.

| Prop           | Type     | Default | Description                 |
| -------------- | -------- | ------- | --------------------------- |
| `defaultIndex` | `number` | `0`     | Initially active tab index  |

### `TabList`

Container for tab triggers. Renders the bottom border and `role="tablist"`.

### `TabTrigger`

Individual tab button with neobrutalism styling.

| Prop    | Type     | Description              |
| ------- | -------- | ------------------------ |
| `index` | `number` | Tab index (zero-based)   |

### `TabContent`

Panel that renders only when its index matches the active tab.

| Prop    | Type     | Description              |
| ------- | -------- | ------------------------ |
| `index` | `number` | Tab index (zero-based)   |
