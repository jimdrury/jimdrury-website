import { describe, expect, it } from "vitest";

import { createRichText } from "./create-richtext";

describe("createRichText", () => {
  it("normalizes non-breaking spaces to regular spaces", () => {
    const RichText = createRichText(() => null);

    const rendered = RichText({
      doc: {
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
      },
    });

    expect(rendered.props.children.props.children).toBe(
      "Industry accolades for shipping",
    );
  });
});
