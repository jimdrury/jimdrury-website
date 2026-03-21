# Timeline

A vertical timeline component with neobrutalism marker dots. Compose `Timeline` with `TimelineItem` children.

## Sub-components

| Component    | Element | Purpose                              |
| ------------ | ------- | ------------------------------------ |
| Timeline     | `<ol>`  | Root ordered list with left border   |
| TimelineItem | `<li>`  | Single event with marker, date, title |

## Usage

```tsx
<Timeline>
  <TimelineItem date="March 2026" title="Project launched">
    Initial release with core features.
  </TimelineItem>
  <TimelineItem date="February 2026" title="Beta testing">
    Invited early adopters.
  </TimelineItem>
</Timeline>
```

## Props

### TimelineItem

| Prop    | Type     | Required | Description                    |
| ------- | -------- | -------- | ------------------------------ |
| `title` | `string` | Yes      | Event heading                  |
| `date`  | `string` | No       | Date label above the title     |
