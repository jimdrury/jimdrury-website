# Select

A neobrutalism-styled select dropdown with optional label. Takes `children` for option elements.

## Import

```tsx
import { Select } from "@/forms/select";
```

## Usage

```tsx
<Select label="Headliner" id="headliner">
  <option value="">Please select</option>
  <option value="JM">John Mayer</option>
  <option value="ED">Ed Sheeran</option>
</Select>
```

## Props

Extends `ComponentProps<"select">`.

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Optional label text displayed above the select |
| `id` | `string` | Links the label to the select |
| `children` | `ReactNode` | Option elements rendered inside the select |

## With optgroup

```tsx
<Select label="Artist" id="artist">
  <optgroup label="Rock">
    <option value="JM">John Mayer</option>
    <option value="JH">Jimi Hendrix</option>
  </optgroup>
  <optgroup label="Pop">
    <option value="TS">Taylor Swift</option>
    <option value="ED">Ed Sheeran</option>
  </optgroup>
</Select>
```

## Composable example

```tsx
<form className="flex flex-col gap-4">
  <Input label="Name" id="name" />
  <Select label="Role" id="role">
    <option value="">Select a role</option>
    <option value="admin">Admin</option>
    <option value="user">User</option>
  </Select>
  <Button type="submit">Save</Button>
</form>
```
