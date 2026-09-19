import {
  BlockTypes,
  ComponentBlok,
  richTextResolver,
  type StoryblokRichTextNode,
} from "@storyblok/js";
import Link from "next/link";
import type { FC, JSXElementConstructor, ReactElement, ReactNode } from "react";
import { Children, createElement, Fragment, isValidElement } from "react";
import { getSafeHref } from "@/lib/assert-safe-href";
import { normalizeEscapedNewlines } from "@/lib/normalize-escaped-newlines";
import { getNextLinkHref, normalizeRichTextHref } from "./internal-href";
import { normalizeRichTextLists } from "./normalize-richtext-lists";
import type { BlokRendererProps, SbBlokData, StoryRenderProps } from "./types";

type RichTextProps = {
  doc: StoryblokRichTextNode<ReactElement>;
} & StoryRenderProps;

type ReactElementWithProps = ReactElement<{
  children?: ReactNode;
  [key: string]: unknown;
}>;

type RichTextElementType = string | JSXElementConstructor<object>;

const NON_BREAKING_SPACE_REGEX = /\u00a0/g;
const CODE_BLOCK_TYPES = new Set(["code_block", "codeBlock"]);

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
  inCodeBlock = false,
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

  const isCodeBlock =
    inCodeBlock ||
    (typeof normalizedNode.type === "string" &&
      CODE_BLOCK_TYPES.has(normalizedNode.type));

  if ("text" in normalizedNode && typeof normalizedNode.text === "string") {
    const text = normalizeRichTextText(normalizedNode.text);
    normalizedNode.text = isCodeBlock ? normalizeEscapedNewlines(text) : text;
  }

  if ("content" in normalizedNode && Array.isArray(normalizedNode.content)) {
    normalizedNode.content = normalizedNode.content.map((child) =>
      normalizeRichTextNode(
        child as StoryblokRichTextNode<ReactElement>,
        isCodeBlock,
      ),
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

const CMS_LINK_ATTRS = new Set([
  "anchor",
  "cached_url",
  "custom",
  "data-anchor",
  "data-linktype",
  "data-uuid",
  "fieldtype",
  "linktype",
  "story",
  "uuid",
]);

const omitCmsLinkAttributes = (
  props: Record<string, unknown>,
): Record<string, unknown> => {
  return Object.entries(props).reduce<Record<string, unknown>>(
    (result, [key, value]) => {
      if (CMS_LINK_ATTRS.has(key)) {
        return result;
      }

      if (key === "id" && typeof value === "number") {
        return result;
      }

      result[key] = value;
      return result;
    },
    {},
  );
};

const withoutNewWindowTarget = (
  props: Record<string, unknown>,
): Record<string, unknown> => {
  const nextProps = { ...props };
  delete nextProps.target;
  return nextProps;
};

const getElementKey = (
  props: Record<string, unknown> | null | undefined,
  fallback?: string | number | null,
): string | number | undefined => {
  if (typeof fallback === "string" || typeof fallback === "number") {
    return fallback;
  }

  const key = props?.key;
  if (typeof key === "string" || typeof key === "number") {
    return key;
  }

  return undefined;
};

const createKeyedElement = (
  type: RichTextElementType,
  props: Record<string, unknown> | null | undefined,
  children: ReactNode,
  key?: string | number,
) => {
  const nextProps =
    key === undefined ? (props ?? null) : { ...(props ?? {}), key };

  return createElement(type, nextProps, ...Children.toArray(children));
};

const createRichTextAnchor = (
  props: Record<string, unknown> | null | undefined,
  children: ReactNode,
  key?: string | number | null,
): ReactElement => {
  const normalizedHref = normalizeRichTextHref(
    props?.href,
    props?.linktype ?? props?.["data-linktype"],
    props?.anchor ?? props?.["data-anchor"],
  );
  const sanitized = sanitizeRenderProps(
    props ? { ...props, href: normalizedHref } : props,
  );
  const linkProps = omitCmsLinkAttributes(sanitized ?? {});
  const href = typeof linkProps.href === "string" ? linkProps.href : undefined;
  const nextHref = href ? getNextLinkHref(href) : undefined;
  const elementKey = getElementKey(linkProps, key);

  if (nextHref) {
    return createKeyedElement(
      Link as RichTextElementType,
      { ...withoutNewWindowTarget(linkProps), href: nextHref },
      children,
      elementKey,
    );
  }

  if (href?.startsWith("#")) {
    return createKeyedElement(
      "a",
      withoutNewWindowTarget(linkProps),
      children,
      elementKey,
    );
  }

  return createKeyedElement(
    "a",
    sanitized ? linkProps : sanitized,
    children,
    elementKey,
  );
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
  type: RichTextElementType,
  props: Record<string, unknown> | null,
  ...children: ReactNode[]
) => {
  if (type === "a") {
    return createRichTextAnchor(props, children, getElementKey(props));
  }

  return createKeyedElement(
    type,
    sanitizeRenderProps(props),
    children,
    getElementKey(props),
  );
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

  if (element.type === "a") {
    return createRichTextAnchor(normalizedProps, children, element.key);
  }

  return createKeyedElement(
    element.type,
    normalizedProps,
    children,
    getElementKey(normalizedProps, element.key),
  );
};

export const createRichText = (
  BlokRenderer: FC<BlokRendererProps>,
): FC<RichTextProps> => {
  const RichText: FC<RichTextProps> = ({ doc, pathname, story }) => {
    const normalizedDoc = normalizeRichTextLists(normalizeRichTextNode(doc));
    let textNodeIndex = 0;
    const resolver = richTextResolver<ReactElement>({
      renderFn: renderRichTextElement,
      textFn: (text) => (
        <Fragment key={`rt-${textNodeIndex++}`}>
          {normalizeRichTextText(text)}
        </Fragment>
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
