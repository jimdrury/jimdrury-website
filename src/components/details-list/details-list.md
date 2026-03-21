# DetailsList

A compound definition list for key-value data display with neobrutalism styling.

## Sub-components

| Component   | Element  | Purpose                         |
| ----------- | -------- | ------------------------------- |
| DetailsList | `<dl>`   | Root wrapper with border/shadow |
| DetailsItem | `<div>`  | Single term-description pair    |

## Usage

```tsx
<DetailsList>
  <DetailsItem term="Name">Alice Johnson</DetailsItem>
  <DetailsItem term="Email">alice@example.com</DetailsItem>
  <DetailsItem term="Role">Engineer</DetailsItem>
</DetailsList>
```

## Props

### DetailsItem

| Prop   | Type        | Description                    |
| ------ | ----------- | ------------------------------ |
| `term` | `ReactNode` | The label rendered inside `dt` |
