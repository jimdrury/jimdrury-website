import parse from "html-react-parser";
import type { FC } from "react";
import {
  SiCss,
  SiHtml5,
  SiJavascript,
  SiMarkdown,
  SiReact,
} from "react-icons/si";
import { VscJson } from "react-icons/vsc";
import type { DecorationItem } from "shiki";
import { codeToHtml } from "shiki";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";
import { SnippetCopyButton } from "./snippet-copy-button";

export type LineHighlight = {
  line: number;
  state: "highlight" | "add" | "remove";
};

export interface SnippetProps extends ComponentPropsWithoutChildren<"figure"> {
  code: string;
  language?: string;
  title?: string;
  highlights?: LineHighlight[];
  wrapLines?: boolean;
  enableCopyToClipboard?: boolean;
}

const stateClass: Record<LineHighlight["state"], string> = {
  highlight: "snippet-line-highlight",
  add: "snippet-line-add",
  remove: "snippet-line-remove",
};

const languageIcons: Record<string, FC<{ className?: string }>> = {
  tsx: SiReact,
  jsx: SiReact,
  js: SiJavascript,
  javascript: SiJavascript,
  json: VscJson,
  md: SiMarkdown,
  markdown: SiMarkdown,
  html: SiHtml5,
  css: SiCss,
};

const LanguageIcon: FC<{ language: string }> = ({ language }) => {
  const Icon = languageIcons[language];
  if (!Icon) return null;
  return <Icon className="size-4 shrink-0" aria-hidden />;
};

const buildDecorations = (highlights: LineHighlight[]): DecorationItem[] =>
  highlights.map(({ line, state }) => ({
    start: { line: line - 1, character: 0 },
    end: { line: line - 1, character: Number.POSITIVE_INFINITY },
    properties: { class: stateClass[state] },
  }));

export const Snippet: FC<SnippetProps> = async ({
  code,
  language = "text",
  title,
  highlights,
  wrapLines = false,
  enableCopyToClipboard = false,
  className,
  ...props
}) => {
  const html = await codeToHtml(code, {
    lang: language,
    theme: "github-dark",
    decorations: highlights?.length ? buildDecorations(highlights) : undefined,
  });
  const accessibleHtml = html
    .replaceAll(/color:\s*#6A737D/gi, "color:#9CA3AF")
    .replaceAll(/<pre([^>]*?)\s+tabindex="[^"]*"/gi, "<pre$1");

  return (
    <figure
      className={cn(
        "overflow-hidden rounded-md border-2 border-black bg-[#24292e] shadow-[4px_4px_0_0]",
        className,
      )}
      {...props}
    >
      {(title || enableCopyToClipboard) && (
        <figcaption className="flex items-center justify-between gap-3 border-b-2 border-black bg-zinc-800 px-4 py-2 font-mono text-sm font-semibold text-zinc-300">
          <div className="flex min-w-0 items-center gap-2">
            {title ? <LanguageIcon language={language} /> : null}
            {title ? <span className="truncate">{title}</span> : null}
          </div>
          {enableCopyToClipboard ? <SnippetCopyButton code={code} /> : null}
        </figcaption>
      )}
      <div
        className={cn(
          "[&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:rounded-none [&_pre]:p-4 [&_pre]:text-sm [&_pre]:leading-relaxed",
          wrapLines &&
            "[&_pre]:overflow-x-hidden [&_pre]:whitespace-pre-wrap [&_pre]:break-words",
          "[&_.snippet-line-highlight]:bg-yellow-500/15",
          "[&_.snippet-line-add]:bg-emerald-500/15",
          "[&_.snippet-line-remove]:bg-red-500/15 [&_.snippet-line-remove]:line-through [&_.snippet-line-remove]:opacity-70",
        )}
      >
        {parse(accessibleHtml)}
      </div>
    </figure>
  );
};
