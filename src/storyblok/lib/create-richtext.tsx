import {
  ComponentBlok,
  richTextResolver,
  type StoryblokRichTextNode,
} from "@storyblok/js";
import type { FC, ReactElement, ReactNode } from "react";
import { Children, createElement, Fragment, isValidElement } from "react";
import type { SbBlokData } from "./types";

type BlokRendererProps = {
  blok: SbBlokData;
};

type RichTextProps = {
  doc: StoryblokRichTextNode<ReactElement>;
};

type ReactElementWithProps = ReactElement<{
  children?: ReactNode;
  [key: string]: unknown;
}>;

const NON_BREAKING_SPACE_REGEX = /\u00a0/g;

const normalizeRichTextText = (text: string): string => {
  return text.replace(NON_BREAKING_SPACE_REGEX, " ");
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

const parseStyle = (value: string): Record<string, string> => {
  return value.split(";").reduce<Record<string, string>>((styles, entry) => {
    const [rawKey, rawValue] = entry.split(":");
    const key = rawKey?.trim();
    const styleValue = rawValue?.trim();

    if (!key || !styleValue) {
      return styles;
    }

    styles[toCamelCase(key)] = styleValue;

    return styles;
  }, {});
};

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

const normalizeElementAttributes = (node: ReactNode): ReactNode => {
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

    if (
      normalizedKey === "style" &&
      (typeof propValue === "string" || propValue instanceof String)
    ) {
      propValue = parseStyle(String(propValue));
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
  const RichText: FC<RichTextProps> = ({ doc }) => {
    const normalizedDoc = normalizeRichTextNode(doc);
    const resolver = richTextResolver<ReactElement>({
      renderFn: createElement,
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
            return <BlokRenderer blok={blok as SbBlokData} key={resolvedKey} />;
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
