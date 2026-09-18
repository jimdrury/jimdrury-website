import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SnippetCopyButton } from "./snippet-copy-button";

describe("SnippetCopyButton", () => {
  it("copies real newlines from the rendered snippet, not literal \\n", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(
      <figure>
        <figcaption>
          <SnippetCopyButton />
        </figcaption>
        <pre>
          <code>{"my-connector/\n├── package.json\n├── src/"}</code>
        </pre>
      </figure>,
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Copy code to clipboard" }),
    );

    expect(writeText).toHaveBeenCalledWith(
      "my-connector/\n├── package.json\n├── src/",
    );
    expect(writeText.mock.calls[0]?.[0]).not.toContain("\\n");
  });
});
