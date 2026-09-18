import type { Mermaid, MermaidConfig } from "mermaid";

const MERMAID_THEME_VARIABLES: NonNullable<MermaidConfig["themeVariables"]> = {
  background: "#fffdf5",
  fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  fontSize: "16px",
  primaryColor: "#ffe156",
  primaryTextColor: "#1a1a1a",
  primaryBorderColor: "#1a1a1a",
  secondaryColor: "#a8d8ea",
  tertiaryColor: "#f5f0e1",
  lineColor: "#1a1a1a",
  textColor: "#1a1a1a",
  mainBkg: "#ffe156",
  nodeBorder: "#1a1a1a",
  clusterBkg: "#f5f0e1",
  clusterBorder: "#1a1a1a",
  titleColor: "#1a1a1a",
  edgeLabelBackground: "#fffdf5",
  actorBkg: "#ffe156",
  actorBorder: "#1a1a1a",
  actorTextColor: "#1a1a1a",
  actorLineColor: "#1a1a1a",
  signalColor: "#1a1a1a",
  signalTextColor: "#1a1a1a",
  labelBoxBkgColor: "#a8d8ea",
  labelBoxBorderColor: "#1a1a1a",
  labelTextColor: "#1a1a1a",
  noteBkgColor: "#c4b5fd",
  noteTextColor: "#1a1a1a",
  noteBorderColor: "#1a1a1a",
};

let mermaidModule: Mermaid | undefined;
let mermaidLoadPromise: Promise<Mermaid> | undefined;

const loadMermaid = (): Promise<Mermaid> => {
  if (mermaidModule) {
    return Promise.resolve(mermaidModule);
  }

  if (!mermaidLoadPromise) {
    mermaidLoadPromise = import("mermaid").then((mod) => {
      const mermaid = mod.default;
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "base",
        look: "neo",
        themeVariables: MERMAID_THEME_VARIABLES,
        flowchart: {
          htmlLabels: false,
          curve: "linear",
        },
      });
      mermaidModule = mermaid;
      return mermaid;
    });
  }

  return mermaidLoadPromise;
};

export const renderMermaidSvg = async (
  source: string,
  id: string,
): Promise<string> => {
  const mermaid = await loadMermaid();
  const { svg } = await mermaid.render(id, source);
  return svg;
};

export const getMermaidErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message.split("\n")[0] ?? "Unable to render diagram";
  }

  return "Unable to render diagram";
};
