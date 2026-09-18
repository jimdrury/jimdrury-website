import "server-only";
import type { FC } from "react";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";

type MermaidBlokData = SbBlokData & {
  source?: string;
  title?: string;
  caption?: string;
  alt?: string;
};

type MermaidBlokProps = {
  blok: MermaidBlokData;
};

export const MermaidBlok: FC<MermaidBlokProps> = ({ blok }) => {
  if (!blok.source?.trim()) {
    return null;
  }

  return (
    <MermaidDiagram
      {...storyblokEditable(blok)}
      source={blok.source}
      title={blok.title}
      caption={blok.caption}
      alt={blok.alt}
    />
  );
};
