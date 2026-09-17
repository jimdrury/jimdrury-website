import type { StoryblokRichTextNode } from "@storyblok/js";
import { describe, expect, it } from "vitest";

import { normalizeRichTextLists } from "./normalize-richtext-lists";

const paragraph = (text: string): StoryblokRichTextNode<unknown> => {
  return {
    type: "paragraph",
    content: [{ type: "text", text }],
  } as StoryblokRichTextNode<unknown>;
};

describe("normalizeRichTextLists", () => {
  it("converts consecutive bullet paragraphs into an unordered list", () => {
    const doc = {
      type: "doc",
      content: [
        paragraph(
          "The Gemini Enterprise footprint covered things people actually use:",
        ),
        paragraph("• Image generation"),
        paragraph("• Chatbots"),
        paragraph("• Agents"),
        paragraph("4,000+ is my cleared claim for that footprint."),
      ],
    } as StoryblokRichTextNode<unknown>;

    expect(normalizeRichTextLists(doc)).toEqual({
      type: "doc",
      content: [
        paragraph(
          "The Gemini Enterprise footprint covered things people actually use:",
        ),
        {
          type: "bullet_list",
          content: [
            {
              type: "list_item",
              content: [paragraph("Image generation")],
            },
            {
              type: "list_item",
              content: [paragraph("Chatbots")],
            },
            {
              type: "list_item",
              content: [paragraph("Agents")],
            },
          ],
        },
        paragraph("4,000+ is my cleared claim for that footprint."),
      ],
    });
  });

  it("converts consecutive numbered paragraphs into an ordered list", () => {
    const doc = {
      type: "doc",
      content: [
        paragraph(
          "Agents do not want your carefully versioned route. They want verbs:",
        ),
        paragraph("1. get_failing_pipeline"),
        paragraph("2. open_preview_and_screenshot"),
        paragraph("3) search_design_tokens"),
      ],
    } as StoryblokRichTextNode<unknown>;

    expect(normalizeRichTextLists(doc)).toEqual({
      type: "doc",
      content: [
        paragraph(
          "Agents do not want your carefully versioned route. They want verbs:",
        ),
        {
          type: "ordered_list",
          content: [
            {
              type: "list_item",
              content: [paragraph("get_failing_pipeline")],
            },
            {
              type: "list_item",
              content: [paragraph("open_preview_and_screenshot")],
            },
            {
              type: "list_item",
              content: [paragraph("search_design_tokens")],
            },
          ],
        },
      ],
    });
  });

  it("leaves native Storyblok lists unchanged", () => {
    const doc = {
      type: "doc",
      content: [
        {
          type: "bullet_list",
          content: [
            {
              type: "list_item",
              content: [paragraph("Item one")],
            },
          ],
        },
      ],
    } as StoryblokRichTextNode<unknown>;

    expect(normalizeRichTextLists(doc)).toEqual(doc);
  });
});
