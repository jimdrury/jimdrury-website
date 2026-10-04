import type { Mermaid, MermaidConfig } from "mermaid";
import { enlargeMermaidSvg } from "./drawing-scale";

const MERMAID_THEME_VARIABLES: NonNullable<MermaidConfig["themeVariables"]> = {
  background: "#fefefe",
  fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  fontSize: "16px",
  primaryColor: "#f386a1",
  primaryTextColor: "#1e1e1e",
  primaryBorderColor: "#1e1e1e",
  secondaryColor: "#dedede",
  tertiaryColor: "#fefefe",
  lineColor: "#1e1e1e",
  textColor: "#1e1e1e",
  mainBkg: "#f386a1",
  nodeBorder: "#1e1e1e",
  clusterBkg: "#dedede",
  clusterBorder: "#1e1e1e",
  titleColor: "#1e1e1e",
  edgeLabelBackground: "#fefefe",
  actorBkg: "#f386a1",
  actorBorder: "#1e1e1e",
  actorTextColor: "#1e1e1e",
  actorLineColor: "#1e1e1e",
  signalColor: "#1e1e1e",
  signalTextColor: "#1e1e1e",
  labelBoxBkgColor: "#09aea1",
  labelBoxBorderColor: "#1e1e1e",
  labelTextColor: "#1e1e1e",
  noteBkgColor: "#d96fbf",
  noteTextColor: "#1e1e1e",
  noteBorderColor: "#1e1e1e",
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
  return enlargeMermaidSvg(svg);
};

export const getMermaidErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message.split("\n")[0] ?? "Unable to render diagram";
  }

  return "Unable to render diagram";
};
