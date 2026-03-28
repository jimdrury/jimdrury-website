import "server-only";
import type { FC } from "react";
import type { LineHighlight } from "@/components/snippet";
import { Snippet } from "@/components/snippet";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";

type CodeBlockHighlight = {
  line: number;
  state: "highlight" | "add" | "remove";
};

type CodeBlockPlugin = {
  plugin: "storyblok-code-block";
  code?: string;
  language?: string;
  title?: string;
  highlights?: CodeBlockHighlight[];
};

type SnippetBlokData = SbBlokData & {
  contents?: CodeBlockPlugin;
  wrap_lines?: boolean;
  enable_copy_to_clipboard?: boolean;
  variant?: "code" | "command_line";
};

type SnippetBlokProps = {
  blok: SnippetBlokData;
};

export const SnippetBlok: FC<SnippetBlokProps> = ({ blok }) => {
  const code = blok.contents?.code;

  if (!code) {
    return null;
  }

  const highlights: LineHighlight[] | undefined = blok.contents?.highlights
    ?.length
    ? blok.contents.highlights
    : undefined;

  return (
    <Snippet
      {...storyblokEditable(blok)}
      code={code}
      language={blok.contents?.language}
      title={blok.contents?.title}
      highlights={highlights}
      wrapLines={blok.wrap_lines}
      enableCopyToClipboard={blok.enable_copy_to_clipboard}
      variant={blok.variant}
    />
  );
};
