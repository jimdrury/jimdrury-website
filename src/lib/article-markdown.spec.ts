import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/blog", () => {
  return {
    getDefaultStoryCategory: vi.fn(() => "nextjs"),
    getStoryDateTime: vi.fn(() => "2026-03-21T12:00:00.000Z"),
    formatStoryDate: vi.fn(() => "Mar 21, 2026"),
  };
});

import { renderArticleMarkdown } from "@/lib/article-markdown";
import type { BlogStory } from "@/storyblok/blog-listings-utils";

const buildStory = (): BlogStory => {
  return {
    id: 101,
    name: "Markdown Output Test",
    slug: "markdown-output-test",
    full_slug: "blog/markdown-output-test",
    tag_list: ["nextjs", "ai"],
    first_published_at: "2026-03-20T12:00:00.000Z",
    published_at: "2026-03-21T12:00:00.000Z",
    content: {
      component: "article",
      excerpt: "Test excerpt",
      body: [
        {
          _uid: "heading-1",
          component: "typography",
          as: "h2",
          content: "Section title",
        },
        {
          _uid: "rich-1",
          component: "rich_text",
          content: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Paragraph text.",
                  },
                  {
                    type: "text",
                    text: "Safe link",
                    marks: [
                      {
                        type: "link",
                        attrs: {
                          href: "https://example.com/docs",
                        },
                      },
                    ],
                  },
                  {
                    type: "text",
                    text: "Unsafe link",
                    marks: [
                      {
                        type: "link",
                        attrs: {
                          href: "javascript:alert(1)",
                        },
                      },
                    ],
                  },
                ],
              },
              {
                type: "bullet_list",
                content: [
                  {
                    type: "list_item",
                    content: [
                      {
                        type: "paragraph",
                        content: [{ type: "text", text: "Item one" }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          _uid: "snippet-1",
          component: "snippet",
          contents: {
            code: "console.log('hello')",
            language: "js",
            title: "Example code",
          },
        },
        {
          _uid: "mermaid-1",
          component: "mermaid",
          source: "flowchart LR\n  A[Start] --> B[End]",
          title: "Request flow",
          caption: "Happy path",
        },
      ],
    },
  };
};

describe("renderArticleMarkdown", () => {
  it("renders front matter and article body as markdown", () => {
    const markdown = renderArticleMarkdown(buildStory());

    expect(markdown).toContain('title: "Markdown Output Test"');
    expect(markdown).toContain('slug: "markdown-output-test"');
    expect(markdown).toContain('path: "/blog/nextjs/markdown-output-test"');
    expect(markdown).toContain(
      'canonical_url: "https://www.jimdrury.co.uk/blog/nextjs/markdown-output-test"',
    );
    expect(markdown).toContain('excerpt: "Test excerpt"');
    expect(markdown).toContain("tags:");
    expect(markdown).toContain('  - "nextjs"');
    expect(markdown).toContain("## Section title");
    expect(markdown).toContain("Paragraph text.");
    expect(markdown).toContain("[Safe link](https://example.com/docs)");
    expect(markdown).toContain("Unsafe link");
    expect(markdown).not.toContain("javascript:");
    expect(markdown).toContain("- Item one");
    expect(markdown).toContain("_Example code_");
    expect(markdown).toContain("```js\nconsole.log('hello')\n```");
    expect(markdown).toContain("_Request flow_");
    expect(markdown).toContain(
      "```mermaid\nflowchart LR\n  A[Start] --> B[End]\n```",
    );
    expect(markdown).toContain("_Happy path_");
  });

  it("falls back to a heading when no body markdown is available", () => {
    const story = buildStory();
    story.content.body = [];

    const markdown = renderArticleMarkdown(story);

    expect(markdown).toContain("# Markdown Output Test");
  });

  it("omits path and canonical_url when the article has no category", async () => {
    const { getDefaultStoryCategory } = await import("@/lib/blog");
    vi.mocked(getDefaultStoryCategory).mockReturnValue(null);

    const markdown = renderArticleMarkdown(buildStory());

    expect(markdown).not.toContain("/blog/null");
    expect(markdown).not.toContain("path:");
    expect(markdown).not.toContain("canonical_url:");
  });
});
