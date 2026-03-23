import type { StoryblokRichTextNode } from "@storyblok/react/rsc";

/**
 * Recursively extracts plain text from a Storyblok richtext document,
 * separating block-level nodes with newlines.
 */
export const richTextToPlainText = (
  node: StoryblokRichTextNode<unknown>,
): string => {
  if (typeof node === "string") {
    return node;
  }

  if (!node || typeof node !== "object") {
    return "";
  }

  if ("text" in node && typeof node.text === "string") {
    return node.text;
  }

  if ("content" in node && Array.isArray(node.content)) {
    const parts = node.content.map((child) =>
      richTextToPlainText(child as StoryblokRichTextNode<unknown>),
    );

    const blockTypes = new Set([
      "paragraph",
      "heading",
      "blockquote",
      "bullet_list",
      "ordered_list",
      "list_item",
      "code_block",
      "horizontal_rule",
    ]);

    const type =
      "type" in node && typeof node.type === "string" ? node.type : undefined;

    return type && blockTypes.has(type)
      ? `${parts.join("")}\n`
      : parts.join("");
  }

  return "";
};
