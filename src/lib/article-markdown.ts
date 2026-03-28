import "server-only";

import {
  formatStoryDate,
  getDefaultStoryCategory,
  getStoryDateTime,
} from "@/lib/blog";
import {
  getArticleCanonicalUrl,
  getArticleExcerpt,
  getArticlePath,
} from "@/lib/seo";
import type { BlogStory } from "@/storyblok/blog-listings-utils";

type StoryblokBlok = {
  _uid?: string;
  component?: string;
  [key: string]: unknown;
};

type StoryblokRichTextNode = {
  type?: string;
  text?: string;
  marks?: { type?: string; attrs?: Record<string, unknown> }[];
  attrs?: Record<string, unknown>;
  content?: StoryblokRichTextNode[];
};

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isBlok = (value: unknown): value is StoryblokBlok => {
  return isObject(value) && typeof value.component === "string";
};

const getString = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const yamlScalar = (value: string | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }

  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
};

const cleanLines = (value: string): string => {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const addYamlField = (
  lines: string[],
  key: string,
  value: string | undefined,
): void => {
  const serialized = yamlScalar(value);
  if (!serialized) {
    return;
  }

  lines.push(`${key}: ${serialized}`);
};

const escapeInlineText = (value: string): string => {
  return value.replace(/([\\`*_[\]<>])/g, "\\$1");
};

const applyTextMarks = (
  text: string,
  marks: StoryblokRichTextNode["marks"],
): string => {
  if (!marks?.length) {
    return escapeInlineText(text);
  }

  let output = escapeInlineText(text);

  for (const mark of marks) {
    if (!mark?.type) {
      continue;
    }

    if (mark.type === "code") {
      output = `\`${output.replace(/`/g, "\\`")}\``;
      continue;
    }

    if (mark.type === "bold") {
      output = `**${output}**`;
      continue;
    }

    if (mark.type === "italic") {
      output = `*${output}*`;
      continue;
    }

    if (mark.type === "strike") {
      output = `~~${output}~~`;
      continue;
    }

    if (mark.type === "link") {
      const href = getString(mark.attrs?.href);
      if (href) {
        output = `[${output}](${href})`;
      }
    }
  }

  return output;
};

const renderRichTextInline = (node: StoryblokRichTextNode): string => {
  if (node.type === "text" && typeof node.text === "string") {
    return applyTextMarks(node.text, node.marks);
  }

  if (node.type === "hard_break") {
    return "  \n";
  }

  if (!Array.isArray(node.content)) {
    return "";
  }

  return node.content.map(renderRichTextInline).join("");
};

const prefixLines = (value: string, prefix: string): string => {
  return value
    .split("\n")
    .map((line) => `${prefix}${line}`)
    .join("\n");
};

const renderRichTextBlock = (
  node: StoryblokRichTextNode,
  listDepth = 0,
): string => {
  const children = Array.isArray(node.content) ? node.content : [];

  if (node.type === "paragraph") {
    return renderRichTextInline(node).trim();
  }

  if (node.type === "heading") {
    const rawLevel = node.attrs?.level;
    const level =
      typeof rawLevel === "number" && Number.isFinite(rawLevel) ? rawLevel : 2;
    const headingLevel = Math.min(6, Math.max(1, level));
    const headingText = renderRichTextInline(node).trim();
    return `${"#".repeat(headingLevel)} ${headingText}`;
  }

  if (node.type === "blockquote") {
    const body = renderRichTextBlocks(children, listDepth);
    return prefixLines(body, "> ");
  }

  if (node.type === "code_block") {
    const language = getString(node.attrs?.class)
      ?.replace(/^language-/, "")
      .toLowerCase();
    const code = children.map((child) => child.text ?? "").join("");
    return `\`\`\`${language ?? ""}\n${code}\n\`\`\``;
  }

  if (node.type === "horizontal_rule") {
    return "---";
  }

  if (node.type === "bullet_list" || node.type === "ordered_list") {
    const ordered = node.type === "ordered_list";
    const indent = "  ".repeat(listDepth);
    const listLines = children
      .filter((child) => child.type === "list_item")
      .map((item, index) => {
        const marker = ordered ? `${index + 1}.` : "-";
        const itemBody = renderRichTextBlocks(item.content ?? [], listDepth + 1)
          .replace(/\n{3,}/g, "\n\n")
          .trim();
        if (!itemBody) {
          return `${indent}${marker}`;
        }

        const [firstLine, ...rest] = itemBody.split("\n");
        const head = `${indent}${marker} ${firstLine}`;
        if (rest.length === 0) {
          return head;
        }

        const continuation = rest
          .map((line) => `${indent}   ${line}`)
          .join("\n");

        return `${head}\n${continuation}`;
      });

    return listLines.join("\n");
  }

  if (node.type === "list_item") {
    return renderRichTextBlocks(children, listDepth + 1);
  }

  return renderRichTextBlocks(children, listDepth);
};

const renderRichTextBlocks = (
  nodes: StoryblokRichTextNode[],
  listDepth = 0,
): string => {
  const blocks = nodes
    .map((node) => renderRichTextBlock(node, listDepth))
    .filter((value) => value.trim().length > 0);

  return blocks.join("\n\n");
};

const renderRichText = (doc: unknown): string => {
  if (!isObject(doc)) {
    return "";
  }

  const root = doc as StoryblokRichTextNode;
  const content = Array.isArray(root.content) ? root.content : [];
  return cleanLines(renderRichTextBlocks(content));
};

const renderTypography = (blok: StoryblokBlok): string => {
  const content = getString(blok.content);
  if (!content) {
    return "";
  }

  const tag = getString(blok.as) ?? "p";
  if (tag === "p") {
    return content;
  }

  const depth = tag.startsWith("h")
    ? Number.parseInt(tag.slice(1), 10)
    : Number.NaN;
  if (!Number.isFinite(depth)) {
    return content;
  }

  const headingDepth = Math.min(6, Math.max(1, depth));
  return `${"#".repeat(headingDepth)} ${content}`;
};

const renderPrompt = (blok: StoryblokBlok): string => {
  const title = getString(blok.title);
  const content = renderRichText(blok.content);
  if (!content) {
    return title ? `> **${title}**` : "";
  }

  const body = prefixLines(content, "> ");
  return title ? `> **${title}**\n>\n${body}` : body;
};

const renderSnippet = (blok: StoryblokBlok): string => {
  const contents = isObject(blok.contents)
    ? (blok.contents as Record<string, unknown>)
    : undefined;
  const code = getString(contents?.code);
  if (!code) {
    return "";
  }

  const language = getString(contents?.language) ?? "";
  const title = getString(contents?.title);
  const fence = `\`\`\`${language}`;
  const block = `${fence}\n${code}\n\`\`\``;

  return title ? `_${title}_\n\n${block}` : block;
};

const renderImage = (blok: StoryblokBlok): string => {
  const image = isObject(blok.image)
    ? (blok.image as Record<string, unknown>)
    : undefined;
  const src = getString(image?.filename);
  if (!src) {
    return "";
  }

  const alt = getString(image?.alt) ?? getString(image?.title) ?? "Image";
  const caption = getString(image?.title) ?? getString(image?.copyright);

  return caption
    ? `![${escapeInlineText(alt)}](${src})\n\n_${caption}_`
    : `![${escapeInlineText(alt)}](${src})`;
};

const renderCitedQuote = (blok: StoryblokBlok): string => {
  const quote = renderRichText(blok.quote);
  const citation = getString(blok.citation);
  const citationContext = getString(blok.citation_context);
  if (!quote && !citation) {
    return "";
  }

  const quoteBody = quote ? prefixLines(quote, "> ") : "";
  const details = [citation, citationContext].filter(Boolean).join(", ");
  if (!details) {
    return quoteBody;
  }

  return `${quoteBody}\n>\n> — ${details}`;
};

const renderNestedBloks = (value: unknown): string => {
  if (!Array.isArray(value)) {
    return "";
  }

  const blocks = value.filter(isBlok).map(renderBlok).filter(Boolean);
  return cleanLines(blocks.join("\n\n"));
};

const renderBlok = (blok: StoryblokBlok): string => {
  if (blok.component === "typography") {
    return renderTypography(blok);
  }

  if (blok.component === "rich_text") {
    return renderRichText(blok.content);
  }

  if (blok.component === "prompt") {
    return renderPrompt(blok);
  }

  if (blok.component === "snippet") {
    return renderSnippet(blok);
  }

  if (blok.component === "image" || blok.component === "hero_image") {
    return renderImage(blok);
  }

  if (blok.component === "cited_quote") {
    return renderCitedQuote(blok);
  }

  if (blok.component === "divider") {
    return "---";
  }

  if (
    blok.component === "article" ||
    blok.component === "page" ||
    blok.component === "section" ||
    blok.component === "grid" ||
    blok.component === "box" ||
    blok.component === "vertical_spacing"
  ) {
    const parts = [
      renderNestedBloks(blok.pre_content),
      renderNestedBloks(blok.body),
      renderNestedBloks(blok.columns),
      renderNestedBloks(blok.post_content),
      renderNestedBloks(blok.overlay),
    ].filter((part) => part.length > 0);
    return cleanLines(parts.join("\n\n"));
  }

  const nestedValues = Object.values(blok)
    .map(renderNestedBloks)
    .filter((part) => part.length > 0);
  return cleanLines(nestedValues.join("\n\n"));
};

const buildFrontMatter = (story: BlogStory): string => {
  const lines = ["---"];
  addYamlField(lines, "title", story.name);
  addYamlField(lines, "slug", story.slug);
  addYamlField(lines, "path", getArticlePath(story));
  addYamlField(lines, "canonical_url", getArticleCanonicalUrl(story));
  addYamlField(lines, "published_at", getStoryDateTime(story));
  addYamlField(lines, "published_label", formatStoryDate(story));
  addYamlField(lines, "category", getDefaultStoryCategory(story) ?? undefined);
  addYamlField(lines, "excerpt", getArticleExcerpt(story));

  if (Array.isArray(story.tag_list) && story.tag_list.length > 0) {
    lines.push("tags:");
    for (const tag of story.tag_list
      .map((value) => value.trim())
      .filter(Boolean)) {
      lines.push(`  - ${yamlScalar(tag)}`);
    }
  }

  lines.push("---");
  return lines.join("\n");
};

export const renderArticleMarkdown = (story: BlogStory): string => {
  const body = renderNestedBloks(story.content.body);
  const frontMatter = buildFrontMatter(story);
  const fallbackHeading = `# ${story.name}`;
  const content = body.length > 0 ? body : fallbackHeading;

  return `${frontMatter}\n\n${content}\n`;
};
