import type { StoryblokRichTextNode } from "@storyblok/js";
import { render, screen } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { createRichText, parseStyle } from "./create-richtext";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    target,
  }: {
    href: string;
    children: ReactNode;
    target?: string;
  }) => (
    <a href={href} data-next-link="true" target={target}>
      {children}
    </a>
  ),
}));

const storyRenderProps = {
  pathname: "/about",
  story: { content: { component: "page" } },
};

const linkDoc = (
  text: string,
  attrs: Record<string, unknown>,
): StoryblokRichTextNode<ReactElement> => {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text,
            marks: [
              {
                type: "link",
                attrs,
              },
            ],
          },
        ],
      },
    ],
  } as StoryblokRichTextNode<ReactElement>;
};

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

    render(<RichText doc={doc} {...storyRenderProps} />);

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

    const { container } = render(<RichText doc={doc} {...storyRenderProps} />);
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

    const { container } = render(<RichText doc={doc} {...storyRenderProps} />);

    expect(
      container.querySelector('a[href="https://example.com/about"]'),
    ).toHaveTextContent("Safe");
    expect(container.querySelector('a[href^="javascript:"]')).toBeNull();
    expect(container).toHaveTextContent("Unsafe");
    expect(
      container.querySelector("a[data-next-link='true']"),
    ).not.toBeInTheDocument();
  });

  it("routes Storyblok story links through Next.js Link without opening a new window", () => {
    const RichText = createRichText(() => null);

    render(
      <RichText
        doc={linkDoc("About", {
          href: "/about",
          linktype: "story",
          target: "_blank",
          uuid: "story-uuid",
        })}
        {...storyRenderProps}
      />,
    );

    const link = screen.getByRole("link", { name: "About" });
    expect(link).toHaveAttribute("href", "/about");
    expect(link).toHaveAttribute("data-next-link", "true");
    expect(link).not.toHaveAttribute("target");
    expect(link).not.toHaveAttribute("linktype");
    expect(link).not.toHaveAttribute("uuid");
  });

  it("routes resolver story slugs that omit a leading slash", () => {
    const RichText = createRichText(() => null);

    render(
      <RichText
        doc={linkDoc("Career", {
          href: "about#career",
          target: "_blank",
        })}
        {...storyRenderProps}
      />,
    );

    const link = screen.getByRole("link", { name: "Career" });
    expect(link).toHaveAttribute("href", "/about#career");
    expect(link).toHaveAttribute("data-next-link", "true");
    expect(link).not.toHaveAttribute("target");
  });

  it("prefixes story slugs and maps /home to /", () => {
    const RichText = createRichText(() => null);

    const { rerender } = render(
      <RichText
        doc={linkDoc("Career", {
          href: "about",
          linktype: "story",
          anchor: "career",
        })}
        {...storyRenderProps}
      />,
    );

    expect(screen.getByRole("link", { name: "Career" })).toHaveAttribute(
      "href",
      "/about#career",
    );
    expect(screen.getByRole("link", { name: "Career" })).toHaveAttribute(
      "data-next-link",
      "true",
    );

    rerender(
      <RichText
        doc={linkDoc("Home", {
          href: "/home",
          linktype: "story",
          target: "_blank",
        })}
        {...storyRenderProps}
      />,
    );

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "data-next-link",
      "true",
    );
  });

  it("treats same-origin absolute URLs as Next.js routes", () => {
    const RichText = createRichText(() => null);

    render(
      <RichText
        doc={linkDoc("Blog", {
          href: "https://www.jimdrury.co.uk/blog",
          linktype: "url",
          target: "_blank",
        })}
        {...storyRenderProps}
      />,
    );

    const link = screen.getByRole("link", { name: "Blog" });
    expect(link).toHaveAttribute("href", "/blog");
    expect(link).toHaveAttribute("data-next-link", "true");
    expect(link).not.toHaveAttribute("target");
  });

  it("keeps fragment links in-page and does not open a new window", () => {
    const RichText = createRichText(() => null);

    render(
      <RichText
        doc={linkDoc("On this page", {
          href: "#section",
          linktype: "url",
          target: "_blank",
        })}
        {...storyRenderProps}
      />,
    );

    const link = screen.getByRole("link", { name: "On this page" });
    expect(link).toHaveAttribute("href", "#section");
    expect(link).not.toHaveAttribute("data-next-link");
    expect(link).not.toHaveAttribute("target");
  });

  it("keeps external URL links as plain anchors", () => {
    const RichText = createRichText(() => null);

    render(
      <RichText
        doc={linkDoc("External", {
          href: "https://example.com/about",
          linktype: "url",
          target: "_blank",
        })}
        {...storyRenderProps}
      />,
    );

    const link = screen.getByRole("link", { name: "External" });
    expect(link).toHaveAttribute("href", "https://example.com/about");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).not.toHaveAttribute("data-next-link");
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

    const { container } = render(<RichText doc={doc} {...storyRenderProps} />);

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

    const { container } = render(<RichText doc={doc} {...storyRenderProps} />);

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

    const { container } = render(<RichText doc={doc} {...storyRenderProps} />);

    const list = container.querySelector("ul");
    expect(list).not.toBeNull();
    expect(list?.querySelectorAll("li")).toHaveLength(1);
    expect(screen.getByText("Footprint covered")).toBeInTheDocument();
  });

  it("turns escaped \\n sequences in code blocks into real line breaks", () => {
    const RichText = createRichText(() => null);
    const doc = {
      type: "doc",
      content: [
        {
          type: "code_block",
          attrs: { class: "language-text" },
          content: [
            {
              type: "text",
              text: "my-connector/\\n├── package.json\\n├── src/",
            },
          ],
        },
      ],
    } as StoryblokRichTextNode<ReactElement>;

    const { container } = render(<RichText doc={doc} {...storyRenderProps} />);
    const code = container.querySelector("pre, code");

    expect(code?.textContent).toBe("my-connector/\n├── package.json\n├── src/");
  });
});
