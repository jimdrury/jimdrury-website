import {
  BlockTypes,
  ComponentBlok,
  richTextResolver,
  type StoryblokRichTextNode,
} from "@storyblok/js";
import type { FC, ReactElement, ReactNode } from "react";
import { Children, createElement, Fragment, isValidElement } from "react";
import { getSafeHref } from "@/lib/assert-safe-href";
import { normalizeRichTextLists } from "./normalize-richtext-lists";
import type { BlokRendererProps, SbBlokData, StoryRenderProps } from "./types";

type RichTextProps = {
  doc: StoryblokRichTextNode<ReactElement>;
} & StoryRenderProps;

type ReactElementWithProps = ReactElement<{
  children?: ReactNode;
  [key: string]: unknown;
}>;

const NON_BREAKING_SPACE_REGEX = /\u00a0/g;

const normalizeRichTextText = (text: string): string => {
  return text.replace(NON_BREAKING_SPACE_REGEX, " ");
};

// Storyblok's richTextResolver registers its list extensions under snake_case
// node names (bullet_list, ordered_list, list_item). Content authored or
// converted with TipTap uses camelCase names (bulletList, orderedList,
// listItem). Without this mapping the resolver finds no matching extension and
// silently drops the whole list, so list content vanishes from the page.
type RichTextNodeType = StoryblokRichTextNode<ReactElement>["type"];

const NODE_TYPE_ALIASES: Record<string, RichTextNodeType> = {
  bulletList: BlockTypes.UL_LIST,
  orderedList: BlockTypes.OL_LIST,
  listItem: BlockTypes.LIST_ITEM,
};

const normalizeRichTextNode = (
  node: StoryblokRichTextNode<ReactElement>,
): StoryblokRichTextNode<ReactElement> => {
  if (!node || typeof node !== "object") {
    return node;
  }

  const normalizedNode: StoryblokRichTextNode<ReactElement> = {
    ...node,
  };

  if (
    "type" in normalizedNode &&
    typeof normalizedNode.type === "string" &&
    normalizedNode.type in NODE_TYPE_ALIASES
  ) {
    normalizedNode.type = NODE_TYPE_ALIASES[normalizedNode.type];
  }

  if ("text" in normalizedNode && typeof normalizedNode.text === "string") {
    normalizedNode.text = normalizeRichTextText(normalizedNode.text);
  }

  if ("content" in normalizedNode && Array.isArray(normalizedNode.content)) {
    normalizedNode.content = normalizedNode.content.map((child) =>
      normalizeRichTextNode(child as StoryblokRichTextNode<ReactElement>),
    );
  }

  return normalizedNode;
};

const toCamelCase = (value: string): string => {
  return value.replace(/-([a-z])/g, (_, character: string) =>
    character.toUpperCase(),
  );
};

const ALLOWED_STYLE_PROPERTIES = new Set([
  "color",
  "background-color",
  "font-size",
  "font-weight",
  "font-style",
  "text-align",
  "text-decoration",
  "text-decoration-line",
  "letter-spacing",
  "line-height",
]);

const UNSAFE_STYLE_VALUE_PATTERN =
  /url\s*\(|expression\s*\(|javascript:|vbscript:|behavior:|@import|-moz-binding/i;

const parseStyle = (value: string): Record<string, string> => {
  return value.split(";").reduce<Record<string, string>>((styles, entry) => {
    const separatorIndex = entry.indexOf(":");
    if (separatorIndex === -1) {
      return styles;
    }

    const key = entry.slice(0, separatorIndex).trim().toLowerCase();
    const styleValue = entry.slice(separatorIndex + 1).trim();

    if (
      !key ||
      !styleValue ||
      !ALLOWED_STYLE_PROPERTIES.has(key) ||
      UNSAFE_STYLE_VALUE_PATTERN.test(styleValue)
    ) {
      return styles;
    }

    styles[toCamelCase(key)] = styleValue;

    return styles;
  }, {});
};

const parseStyleObject = (
  value: Record<string, unknown>,
): Record<string, string> => {
  return Object.entries(value).reduce<Record<string, string>>(
    (styles, [rawKey, rawValue]) => {
      if (typeof rawValue !== "string") {
        return styles;
      }

      const key = rawKey
        .replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`)
        .toLowerCase();

      if (
        !ALLOWED_STYLE_PROPERTIES.has(key) ||
        UNSAFE_STYLE_VALUE_PATTERN.test(rawValue)
      ) {
        return styles;
      }

      styles[toCamelCase(key)] = rawValue.trim();
      return styles;
    },
    {},
  );
};

export { parseStyle };

const attributeMap: Record<string, string> = {
  allowfullscreen: "allowFullScreen",
  autocomplete: "autoComplete",
  autofocus: "autoFocus",
  autoplay: "autoPlay",
  charset: "charSet",
  class: "className",
  colspan: "colSpan",
  colwidth: "colWidth",
  contenteditable: "contentEditable",
  crossorigin: "crossOrigin",
  enctype: "encType",
  for: "htmlFor",
  formnovalidate: "formNoValidate",
  frameborder: "frameBorder",
  inputmode: "inputMode",
  marginheight: "marginHeight",
  marginwidth: "marginWidth",
  maxlength: "maxLength",
  minlength: "minLength",
  novalidate: "noValidate",
  playsinline: "playsInline",
  readonly: "readOnly",
  referrerpolicy: "referrerPolicy",
  rowspan: "rowSpan",
  srcset: "srcSet",
  tabindex: "tabIndex",
  targetAttr: "targetattr",
  usemap: "useMap",
};

const sanitizeRenderProps = (
  props: Record<string, unknown> | null | undefined,
): Record<string, unknown> | null | undefined => {
  if (!props) {
    return props;
  }

  const nextProps: Record<string, unknown> = { ...props };

  for (const hrefKey of ["href", "xlinkHref"] as const) {
    if (!(hrefKey in nextProps)) {
      continue;
    }

    const safeHref =
      typeof nextProps[hrefKey] === "string"
        ? getSafeHref(nextProps[hrefKey])
        : undefined;

    if (safeHref) {
      nextProps[hrefKey] = safeHref;
    } else {
      delete nextProps[hrefKey];
    }
  }

  if (
    typeof nextProps.style === "string" ||
    nextProps.style instanceof String
  ) {
    nextProps.style = parseStyle(String(nextProps.style));
  } else if (nextProps.style && typeof nextProps.style === "object") {
    nextProps.style = parseStyleObject(
      nextProps.style as Record<string, unknown>,
    );
  }

  return nextProps;
};

const renderRichTextElement = (
  type: Parameters<typeof createElement>[0],
  props: Record<string, unknown> | null,
  ...children: ReactNode[]
) => {
  return createElement(type, sanitizeRenderProps(props), ...children);
};

const normalizeElementAttributes = (node: ReactNode): ReactNode => {
  if (Array.isArray(node)) {
    return node.map((child) => normalizeElementAttributes(child));
  }

  if (!isValidElement(node)) {
    return node;
  }

  const element = node as ReactElementWithProps;
  const normalizedProps = Object.keys(element.props ?? {}).reduce<
    Record<string, unknown>
  >((result, key) => {
    let propValue = element.props[key];
    const trimmedKey = key.trim();
    const lowerKey = trimmedKey.toLowerCase();
    const normalizedKey = attributeMap[lowerKey] ?? trimmedKey;

    if (normalizedKey === "style") {
      if (typeof propValue === "string" || propValue instanceof String) {
        propValue = parseStyle(String(propValue));
      } else if (propValue && typeof propValue === "object") {
        propValue = parseStyleObject(propValue as Record<string, unknown>);
      }
    }

    if (
      (normalizedKey === "href" || normalizedKey === "xlinkHref") &&
      typeof propValue === "string"
    ) {
      const safeHref = getSafeHref(propValue);

      if (!safeHref) {
        return result;
      }

      result[normalizedKey] = safeHref;
      return result;
    }

    result[normalizedKey] = propValue;

    return result;
  }, {});

  const children = Children.map(element.props.children, (child) =>
    normalizeElementAttributes(child),
  );

  return createElement(element.type, normalizedProps, children);
};

export const createRichText = (
  BlokRenderer: FC<BlokRendererProps>,
): FC<RichTextProps> => {
  const RichText: FC<RichTextProps> = ({ doc, pathname, story }) => {
    const normalizedDoc = normalizeRichTextLists(normalizeRichTextNode(doc));
    const resolver = richTextResolver<ReactElement>({
      renderFn: renderRichTextElement,
      textFn: (text) => (
        <Fragment key={`rt-${text}`}>{normalizeRichTextText(text)}</Fragment>
      ),
      keyedResolvers: true,
      tiptapExtensions: {
        blok: ComponentBlok.configure({
          renderComponent: (blok, key) => {
            const resolvedKey =
              key ??
              `fallback-key-${typeof blok === "object" ? JSON.stringify(blok) : ""}`;
            return (
              <BlokRenderer
                blok={blok as SbBlokData}
                key={resolvedKey}
                pathname={pathname}
                story={story}
              />
            );
          },
        }),
      },
    });

    const rendered = resolver.render(normalizedDoc);

    return <>{normalizeElementAttributes(rendered)}</>;
  };

  RichText.displayName = "RichText";

  return RichText;
};
