const FENCED_MERMAID_PATTERN = /^```(?:mermaid)?[^\n]*\n([\s\S]*?)\n```$/i;

export const normalizeMermaidSource = (source: string): string => {
  const trimmed = source.trim();
  const fenced = FENCED_MERMAID_PATTERN.exec(trimmed);
  return (fenced?.[1] ?? trimmed).trim();
};
