import { render } from "@testing-library/react";
import type { FC } from "react";
import { describe, expect, it, vi } from "vitest";
import { SnippetBlok } from "./SnippetBlok";

vi.mock("@/components/snippet", () => ({
  Snippet: (({ code, title }) => (
    <figure>
      {title ? <figcaption>{title}</figcaption> : null}
      <pre>
        <code>{code}</code>
      </pre>
    </figure>
  )) as FC<{ code: string; title?: string }>,
}));

describe("SnippetBlok", () => {
  it("turns stored \\n sequences into real line breaks before render", () => {
    const { container } = render(
      <SnippetBlok
        blok={{
          _uid: "snippet-1",
          component: "snippet",
          contents: {
            plugin: "storyblok-code-block",
            language: "text",
            title: "my-connector/",
            code: "my-connector/\\n├── package.json\\n├── src/",
          },
          enable_copy_to_clipboard: true,
        }}
      />,
    );

    expect(container.querySelector("code")?.textContent).toBe(
      "my-connector/\n├── package.json\n├── src/",
    );
  });

  it("keeps snippets that already contain real newlines", () => {
    const code = "my-connector/\n├── package.json\n├── src/";

    const { container } = render(
      <SnippetBlok
        blok={{
          _uid: "snippet-2",
          component: "snippet",
          contents: {
            plugin: "storyblok-code-block",
            language: "text",
            code,
          },
        }}
      />,
    );

    expect(container.querySelector("code")?.textContent).toBe(code);
  });
});
