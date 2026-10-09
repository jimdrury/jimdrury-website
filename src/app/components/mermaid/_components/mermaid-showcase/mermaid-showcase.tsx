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
        <p className="font-mono text-xs font-bold uppercase tracking-[2px]">
          Components
        </p>
        <h1 className="text-4xl font-black tracking-tight">Mermaid diagram</h1>
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
