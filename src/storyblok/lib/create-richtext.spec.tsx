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

  it("renders camelCase TipTap bulletList as a real <ul>/<li>", () => {
    const RichText = createRichText(() => null);
    const doc = {
      type: "doc",
      content: [
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "First step" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Second step" }],
                },
              ],
            },
          ],
        },
      ],
    } as unknown as StoryblokRichTextNode<ReactElement>;

    const { container } = render(<RichText doc={doc} />);

    const list = container.querySelector("ul");
    expect(list).not.toBeNull();
    expect(list?.querySelectorAll("li")).toHaveLength(2);
    expect(screen.getByText("First step")).toBeInTheDocument();
    expect(screen.getByText("Second step")).toBeInTheDocument();
  });

  it("renders camelCase TipTap orderedList as a real <ol>/<li>", () => {
    const RichText = createRichText(() => null);
    const doc = {
      type: "doc",
      content: [
        {
          type: "orderedList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Step one" }],
                },
              ],
            },
          ],
        },
      ],
    } as unknown as StoryblokRichTextNode<ReactElement>;

    const { container } = render(<RichText doc={doc} />);

    const list = container.querySelector("ol");
    expect(list).not.toBeNull();
    expect(list?.querySelectorAll("li")).toHaveLength(1);
    expect(screen.getByText("Step one")).toBeInTheDocument();
  });

  it("renders snake_case Storyblok bullet_list as a real <ul>/<li>", () => {
    const RichText = createRichText(() => null);
    const doc = {
      type: "doc",
      content: [
        {
          type: "bullet_list",
          content: [
            {
              type: "list_item",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Footprint covered" }],
                },
              ],
            },
          ],
        },
      ],
    } as unknown as StoryblokRichTextNode<ReactElement>;

    const { container } = render(<RichText doc={doc} />);

    const list = container.querySelector("ul");
    expect(list).not.toBeNull();
    expect(list?.querySelectorAll("li")).toHaveLength(1);
    expect(screen.getByText("Footprint covered")).toBeInTheDocument();
  });
});
