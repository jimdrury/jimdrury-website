import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { brandAccent } from "./brand-accent";

describe("brandAccent", () => {
  it("matches the --bg-accent-rose token in global styles", () => {
    const css = readFileSync(
      join(process.cwd(), "src/app/globals.css"),
      "utf8",
    );

    expect(css).toContain(`--bg-accent-rose: ${brandAccent};`);
  });
});
