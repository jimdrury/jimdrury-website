import type { StoryblokRichTextNode } from "@storyblok/js";

const UNORDERED_MARKER_PATTERN = /^[•·●]\s*/u;
const ORDERED_MARKER_PATTERN = /^\d+[.)]\s+/u;

type ListKind = "bullet_list" | "ordered_list";

type RichTextNode = {
  type?: string;
  text?: string;
  content?: RichTextNode[];
  [key: string]: unknown;
};

const getNodeText = (node: RichTextNode): string => {
  if (typeof node.text === "string") {
    return node.text;
  }

  if (!Array.isArray(node.content)) {
    return "";
  }

  return node.content.map((child) => getNodeText(child)).join("");
};

const getListKind = (node: RichTextNode): ListKind | null => {
  if (node.type !== "paragraph") {
    return null;
  }

  const text = getNodeText(node);

  if (UNORDERED_MARKER_PATTERN.test(text)) {
    return "bullet_list";
  }

  if (ORDERED_MARKER_PATTERN.test(text)) {
    return "ordered_list";
  }

  return null;
};

const getMarkerPattern = (kind: ListKind): RegExp => {
  switch (kind) {
    case "bullet_list":
      return UNORDERED_MARKER_PATTERN;
    case "ordered_list":
      return ORDERED_MARKER_PATTERN;
    default: {
      const exhaustive: never = kind;
      return exhaustive;
    }
  }
};

const stripLeadingMarker = (
  nodes: RichTextNode[] | undefined,
  marker: RegExp,
): RichTextNode[] => {
  if (!nodes?.length) {
    return [];
  }

  const [first, ...rest] = nodes;

  if (first.type === "text" && typeof first.text === "string") {
    const nextText = first.text.replace(marker, "");

    if (!nextText) {
      return rest;
    }

    return [{ ...first, text: nextText }, ...rest];
  }

  return nodes;
};

const toListItem = (paragraph: RichTextNode, kind: ListKind): RichTextNode => {
  return {
    type: "list_item",
    content: [
      {
        ...paragraph,
        type: "paragraph",
        content: stripLeadingMarker(paragraph.content, getMarkerPattern(kind)),
      },
    ],
  };
};

const groupListParagraphs = (nodes: RichTextNode[]): RichTextNode[] => {
  const grouped: RichTextNode[] = [];
  let index = 0;

  while (index < nodes.length) {
    const kind = getListKind(nodes[index]);

    if (!kind) {
      grouped.push(nodes[index]);
      index += 1;
      continue;
    }

    const items: RichTextNode[] = [];

    while (index < nodes.length && getListKind(nodes[index]) === kind) {
      items.push(toListItem(nodes[index], kind));
      index += 1;
    }

    grouped.push({
      type: kind,
      content: items,
    });
  }

  return grouped;
};

export const normalizeRichTextLists = <T>(
  node: StoryblokRichTextNode<T>,
): StoryblokRichTextNode<T> => {
  if (!node || typeof node !== "object") {
    return node;
  }

  const normalizedNode: RichTextNode = {
    ...(node as RichTextNode),
  };

  if (!Array.isArray(normalizedNode.content)) {
    return normalizedNode as StoryblokRichTextNode<T>;
  }

  const normalizedChildren = normalizedNode.content.map((child) =>
    normalizeRichTextLists(child as StoryblokRichTextNode<T>),
  );

  normalizedNode.content = groupListParagraphs(
    normalizedChildren as RichTextNode[],
  );

  return normalizedNode as StoryblokRichTextNode<T>;
};
