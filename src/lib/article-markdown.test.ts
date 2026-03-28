import { describe, expect, it } from "vitest";
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
                content: [{ type: "text", text: "Paragraph text." }],
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
    expect(markdown).toContain('canonical_url: "https://www.jimdrury.co.uk/blog/nextjs/markdown-output-test"');
    expect(markdown).toContain('excerpt: "Test excerpt"');
    expect(markdown).toContain("tags:");
    expect(markdown).toContain('  - "nextjs"');
    expect(markdown).toContain("## Section title");
    expect(markdown).toContain("Paragraph text.");
    expect(markdown).toContain("- Item one");
    expect(markdown).toContain("_Example code_");
    expect(markdown).toContain("```js\nconsole.log('hello')\n```");
  });

  it("falls back to a heading when no body markdown is available", () => {
    const story = buildStory();
    story.content.body = [];

    const markdown = renderArticleMarkdown(story);

    expect(markdown).toContain("# Markdown Output Test");
  });
});
