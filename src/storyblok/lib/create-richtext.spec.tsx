import type { StoryblokRichTextNode } from "@storyblok/js";
import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";

import { createRichText, parseStyle } from "./create-richtext";

describe("createRichText", () => {
  it("normalizes non-breaking spaces to regular spaces", () => {
    const RichText = createRichText(() => null);
    const doc = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Industry\u00a0accolades\u00a0for\u00a0shipping",
            },
          ],
        },
      ],
    } as StoryblokRichTextNode<ReactElement>;

    render(<RichText doc={doc} />);

    expect(
      screen.getByText("Industry accolades for shipping"),
    ).toBeInTheDocument();
  });

  it("renders bullet-prefixed paragraphs as a compact unordered list", () => {
    const RichText = createRichText(() => null);
    const doc = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "• Image generation" }],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "• Chatbots" }],
        },
      ],
    } as StoryblokRichTextNode<ReactElement>;

    const { container } = render(<RichText doc={doc} />);
    const items = container.querySelectorAll("ul > li");

    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Image generation");
    expect(items[1]).toHaveTextContent("Chatbots");
    expect(container.querySelector("p")?.textContent).not.toMatch(/^•/);
  });

  it("keeps allowlisted rich-text links and drops javascript hrefs", () => {
    const RichText = createRichText(() => null);
    const doc = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Safe",
              marks: [
                {
                  type: "link",
                  attrs: {
                    href: "https://example.com/about",
                    linktype: "url",
                  },
                },
              ],
            },
            {
              type: "text",
              text: " ",
            },
            {
              type: "text",
              text: "Unsafe",
              marks: [
                {
                  type: "link",
                  attrs: {
                    href: "javascript:alert(1)",
                    linktype: "url",
                  },
                },
              ],
            },
          ],
        },
      ],
    } as StoryblokRichTextNode<ReactElement>;

    const { container } = render(<RichText doc={doc} />);

    expect(
      container.querySelector('a[href="https://example.com/about"]'),
    ).toHaveTextContent("Safe");
    expect(container.querySelector('a[href^="javascript:"]')).toBeNull();
    expect(container).toHaveTextContent("Unsafe");
  });

  it("allowlists CSS properties on inline style strings", () => {
    expect(
      parseStyle(
        "color: #111111; text-align: center; background-image: url(javascript:alert(1)); position: fixed; width: expression(alert(1))",
      ),
    ).toEqual({
      color: "#111111",
      textAlign: "center",
    });
  });
});
