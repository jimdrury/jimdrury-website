import type { StoryblokRichTextNode } from "@storyblok/js";
import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";

import { createRichText } from "./create-richtext";

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
});
