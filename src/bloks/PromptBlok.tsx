import "server-only";
import {
  type SbBlokData,
  type StoryblokRichTextNode,
  StoryblokServerRichText,
  storyblokEditable,
} from "@storyblok/react/rsc";
import { type FC, type ReactElement, use } from "react";
import { Prompt } from "@/components/prompt";
import { richTextToPlainText } from "@/lib/storyblok-richtext-to-plain-text";

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

const getCachedRichText = async (
  doc: StoryblokRichTextNode<ReactElement>,
): Promise<ReactElement> => {
  "use cache";
  return <StoryblokServerRichText doc={doc} />;
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
      {use(getCachedRichText(blok.content))}
    </Prompt>
  );
};
