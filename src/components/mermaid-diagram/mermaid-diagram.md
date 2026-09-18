# Mermaid diagram

Renders Mermaid source as an SVG inside a zoomable, pannable viewport (Google Maps–style: scroll/pinch zoom, drag to pan, labelled +/−/fit controls). Used by the Storyblok `mermaid` blok on article pages. The Mermaid library is loaded only in the browser when a diagram mounts. Diagrams are drawn 25% larger than Mermaid’s stock output, so 100% zoom is the readable default rather than a viewport zoom-in. Fit never magnifies past that natural size.

## Storyblok editors

1. In an article (or any `components` folder body), add a **Mermaid diagram** blok.
2. Paste **raw Mermaid source** into **source** — the diagram body only, not a Markdown fence.
3. Optionally set **title** (bar above the chart), **caption** (text below), and **alt** (accessible name).

Example source:

```
flowchart LR
  Draft[Write Mermaid] --> Paste[Paste into the blok]
  Paste --> Readers[Readers zoom and pan]
```

Draft and preview at [mermaid.live](https://mermaid.live) first if you want. If you accidentally paste a ` ```mermaid ` fence, the site strips it.

Readers get zoom in, zoom out, fit-to-view, wheel/pinch zoom, and drag-to-pan. The source stays available as a text fallback for assistive tech.

## Import

```tsx
import { MermaidDiagram } from "@/components/mermaid-diagram";
```

## Usage

```tsx
<MermaidDiagram
  source={`flowchart LR
    A[Start] --> B[End]`}
  title="Request flow"
  caption="Happy path from start to end."
  alt="Flowchart from start to end"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `string` | — | Mermaid diagram source. Required. Empty or whitespace-only source renders nothing. |
| `title` | `string` | — | Optional heading above the viewport. |
| `caption` | `string` | — | Optional caption below the viewport. |
| `alt` | `string` | title, or `"Mermaid diagram"` | Accessible name for the figure and viewport. |
| `className` | `string` | — | Merged onto the wrapping `<figure>`. |
| *…rest* | `ComponentProps<"figure">` | — | Native figure attributes. |
