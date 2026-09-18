import type { StoryblokRichTextNode } from "@storyblok/js";
import { describe, expect, it } from "vitest";
import { richTextToPlainText } from "./richtext-to-plain-text";

describe("richTextToPlainText", () => {
  it("turns escaped \\n sequences in code blocks into real line breaks", () => {
    const text = richTextToPlainText({
      type: "doc",
      content: [
        {
          type: "code_block",
          content: [
            {
              type: "text",
              text: 'import { z } from "zod";\\n\\nexport const listIssues = {};',
            },
          ],
        },
      ],
    } as StoryblokRichTextNode<unknown>);

    expect(text).toBe(
      'import { z } from "zod";\n\nexport const listIssues = {};\n',
    );
  });
});
