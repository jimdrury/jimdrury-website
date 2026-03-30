import "server-only";
import type { FC, ReactElement } from "react";
import { Prompt } from "@/components/prompt";
import {
  type SbBlokData,
  type StoryblokRichTextNode,
  storyblokEditable,
} from "@/storyblok/lib";
import { RichText } from "@/storyblok/renderer";
import { richTextToPlainText } from "@/storyblok/richtext-to-plain-text";

type PromptBlokData = SbBlokData & {
  title?: string;
  content?: StoryblokRichTextNode<ReactElement>;
  enable_copy_to_clipboard?: boolean;
};

type PromptBlokProps = {
  blok: PromptBlokData;
};

const buildCopyText = (title: string | undefined, body: string): string => {
  const trimmed = body.trimEnd();
  if (!title) return trimmed;
  return `<${title}>\n${trimmed}\n</${title}>`;
};

export const PromptBlok: FC<PromptBlokProps> = ({ blok }) => {
  if (!blok.content) {
    return null;
  }

  const copyText = blok.enable_copy_to_clipboard
    ? buildCopyText(blok.title, richTextToPlainText(blok.content))
    : undefined;

  return (
    <Prompt {...storyblokEditable(blok)} title={blok.title} copyText={copyText}>
      <RichText doc={blok.content} />
    </Prompt>
  );
};
