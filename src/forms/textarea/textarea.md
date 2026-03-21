# Textarea

A neobrutalism-styled textarea with optional label. Defaults to 4 rows with no resize.

## Import

```tsx
import { Textarea } from "@/forms/textarea";
```

## Usage

```tsx
<Textarea label="Notes" id="notes" />
<Textarea label="Message" id="message" placeholder="Type your message here..." />
<Textarea label="Bio" id="bio" rows={6} />
```

## Props

Extends `ComponentProps<"textarea">`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Optional label text displayed above the textarea |
| `id` | `string` | — | Links the label to the textarea |
| `rows` | `number` | `4` | Number of visible text rows |

## Composable example

```tsx
<form className="flex flex-col gap-4">
  <Input label="Subject" id="subject" />
  <Textarea label="Message" id="message" placeholder="Type your message..." />
  <Button type="submit">Send</Button>
</form>
```
