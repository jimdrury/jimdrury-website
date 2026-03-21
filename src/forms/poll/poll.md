# Poll

A poll built as an accessible **radio group** (`<fieldset>` + `<legend>` + `<input type="radio">`). Client component for controlled / uncontrolled state.

## Sub-components

| Component    | Element                         | Description                                      |
| ------------ | ------------------------------- | ------------------------------------------------ |
| `Poll`       | `<fieldset>`                    | Question as legend; provides group `name` / state |
| `PollOption` | `<label>` + `<input type="radio">` | Option label, optional vote count             |

## Props

### `Poll`

| Prop             | Type                        | Default   | Description                          |
| ---------------- | --------------------------- | --------- | ------------------------------------ |
| `question`       | `string`                    | —         | Legend text (required)               |
| `name`           | `string`                    | `"poll"`  | Radio `name` (form submission)       |
| `value`          | `string`                    | —         | Controlled selected option `value`   |
| `defaultValue`   | `string`                    | `""`      | Uncontrolled initial selection       |
| `onValueChange`  | `(value: string) => void`   | —         | Fires when selection changes         |

### `PollOption`

| Prop          | Type     | Default | Description                          |
| ------------- | -------- | ------- | ------------------------------------ |
| `value`       | `string` | —       | Radio value (required)             |
| `votes`       | `number` | —       | Optional vote count display        |
| `formatVotes` | fn       | …       | Custom formatter for `votes`       |

Other props are forwarded to the `<input type="radio">` (except `type` and `name`).

## Usage

```tsx
import { Poll, PollOption } from "@/forms/poll";

<Poll
  question="What's your favourite framework?"
  name="framework"
  defaultValue="react"
  onValueChange={(v) => console.log(v)}
>
  <PollOption value="react">React</PollOption>
  <PollOption value="vue">Vue</PollOption>
  <PollOption value="svelte" votes={15}>
    Svelte
  </PollOption>
</Poll>
```

Inside a `<form>`, the selected radio is submitted under `name`.
