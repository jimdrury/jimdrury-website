import { describe, expect, it } from "vitest";
import { normalizeEscapedNewlines } from "./normalize-escaped-newlines";

describe("normalizeEscapedNewlines", () => {
  it("converts two-character \\n sequences into real line breaks", () => {
    const stored =
      "my-connector/\\n├── package.json\\n├── src/\\n│   ├── index.ts";

    expect(normalizeEscapedNewlines(stored)).toBe(
      [
        "my-connector/",
        "├── package.json",
        "├── src/",
        "│   ├── index.ts",
      ].join("\n"),
    );
  });

  it("converts escaped blank lines used in TypeScript and JSON snippets", () => {
    const stored =
      'import { z } from "zod";\\n\\nexport const listIssues = {};';

    expect(normalizeEscapedNewlines(stored)).toBe(
      'import { z } from "zod";\n\nexport const listIssues = {};',
    );
  });

  it("converts escaped CRLF and CR sequences", () => {
    expect(normalizeEscapedNewlines("one\\r\\ntwo\\rthree")).toBe(
      "one\ntwo\nthree",
    );
  });

  it("leaves snippets that already use real newlines unchanged", () => {
    const alreadyMultiline = "my-connector/\n├── package.json\n├── src/";

    expect(normalizeEscapedNewlines(alreadyMultiline)).toBe(alreadyMultiline);
  });

  it("still converts leftover escaped sequences when real newlines are present", () => {
    expect(normalizeEscapedNewlines("already\nbroken\\nup")).toBe(
      "already\nbroken\nup",
    );
  });

  it("is a no-op for strings without escapes", () => {
    expect(normalizeEscapedNewlines("console.log('hello')")).toBe(
      "console.log('hello')",
    );
    expect(normalizeEscapedNewlines("")).toBe("");
  });
});
