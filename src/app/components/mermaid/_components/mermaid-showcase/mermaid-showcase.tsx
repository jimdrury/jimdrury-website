import type { FC } from "react";
import { MermaidDiagram } from "@/components/mermaid-diagram";

const FLOWCHART_SOURCE = `flowchart LR
  Editor[Paste Mermaid] --> Blok[Mermaid blok]
  Blok --> Readers[Zoom and pan]
`;

const SEQUENCE_SOURCE = `sequenceDiagram
  participant Editor
  participant Storyblok
  participant Site
  Editor->>Storyblok: Paste diagram source
  Storyblok->>Site: Deliver mermaid blok
  Site->>Editor: Zoomable SVG
`;

export const MermaidShowcase: FC = () => {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-16 pb-24">
      <header className="space-y-3">
        <p className="font-[family-name:var(--font-pixel),var(--font-mono)] text-[13px] font-normal capitalize tracking-[0.05em] text-[var(--fg-secondary)]">
          Components
        </p>
        <h1 className="font-[family-name:var(--font-geist-sans)] text-4xl font-medium tracking-[-0.04em]">
          Mermaid diagram
        </h1>
        <p className="max-w-prose text-lg">
          Scroll or pinch to zoom, drag to pan, and use the labelled controls.
          This is the same component Storyblok articles render from a{" "}
          <span className="font-mono">mermaid</span> blok.
        </p>
      </header>

      <MermaidDiagram
        source={FLOWCHART_SOURCE}
        title="Editor to reader"
        caption="Paste source in Storyblok; readers get a map-style viewport."
        alt="Flowchart from pasting Mermaid to zooming on the live site"
      />

      <MermaidDiagram
        source={SEQUENCE_SOURCE}
        title="How it is published"
        alt="Sequence diagram of editor, Storyblok, and the site"
      />
    </div>
  );
};
