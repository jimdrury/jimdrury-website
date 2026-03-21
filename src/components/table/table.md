# Table

A compound data-display table with neobrutalism styling. Compose `Table`, `TableHead`, `TableBody`, `TableRow`, and `TableCell` to build flexible tabular layouts.

## Sub-components

| Component   | Element   | Purpose                        |
| ----------- | --------- | ------------------------------ |
| Table       | `<table>` | Root wrapper with border/shadow |
| TableHead   | `<thead>` | Header section                 |
| TableBody   | `<tbody>` | Body section with row dividers |
| TableRow    | `<tr>`    | Single row                     |
| TableCell   | `<td/th>` | Cell — set `header` for `<th>` |

## Usage

```tsx
<Table>
  <TableHead>
    <TableRow>
      <TableCell header>Name</TableCell>
      <TableCell header>Role</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>Alice</TableCell>
      <TableCell>Engineer</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Props

All sub-components extend the native HTML element props via `ComponentProps<'element'>`.

### TableCell

| Prop     | Type      | Default | Description                  |
| -------- | --------- | ------- | ---------------------------- |
| `header` | `boolean` | `false` | Renders as `<th>` when true  |
