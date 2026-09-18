import type { Metadata } from "next";
import type { FC } from "react";

import { MermaidShowcase } from "./_components/mermaid-showcase/mermaid-showcase";

export const metadata: Metadata = {
  title: "Mermaid diagram",
  description:
    "Zoomable, pannable Mermaid diagrams with map-style controls, used by the Storyblok mermaid blok.",
};

const Page: FC<PageProps<"/components/mermaid">> = () => {
  return <MermaidShowcase />;
};

export default Page;
