# FileUploader

A neobrutalism-styled file upload drop zone.

## Import

```tsx
import { FileUploader } from "@/forms/file-uploader";
```

## Usage

```tsx
<FileUploader id="file-upload" />
<FileUploader label="Upload your CV" id="cv-upload" />
<FileUploader label="Upload an image" id="image-upload" accept="image/*" />
```

## Props

Extends `ComponentProps<"input">`.

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Custom label text (defaults to "Click or drag to upload") |
| `id` | `string` | Links the label to the hidden file input |
| `accept` | `string` | File type filter (e.g. `"image/*"`) |
