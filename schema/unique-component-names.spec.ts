import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const SCHEMA_ROOT = import.meta.dirname;
const COMPONENT_NAME_PATTERN =
  /export default (?:contentType|nestable)\(\{\s*name:\s*"([^"]+)"/;

const collectSchemaFiles = (directory: string): string[] => {
  const files: string[] = [];

  for (const entry of readdirSync(directory)) {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...collectSchemaFiles(fullPath));
      continue;
    }

    if (entry.endsWith(".ts") && !entry.endsWith(".spec.ts")) {
      files.push(fullPath);
    }
  }

  return files;
};

describe("Storyblok schema component names", () => {
  it("are unique across schema modules", () => {
    const filesByName = new Map<string, string[]>();

    for (const file of collectSchemaFiles(SCHEMA_ROOT)) {
      const source = readFileSync(file, "utf8");
      const match = COMPONENT_NAME_PATTERN.exec(source);
      const relativePath = relative(SCHEMA_ROOT, file);

      expect(match).not.toBeNull();
      const name = match?.[1];
      expect(name).toBeTruthy();
      if (!name) {
        continue;
      }

      const files = filesByName.get(name) ?? [];
      files.push(relativePath);
      filesByName.set(name, files);
    }

    const duplicates = [...filesByName.entries()].filter(
      ([, files]) => files.length > 1,
    );

    expect(duplicates).toEqual([]);
  });
});
