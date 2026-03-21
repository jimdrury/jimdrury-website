import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.join(dirname, "src"),
      "server-only": path.join(dirname, "src/testing/server-only.ts"),
    },
  },
  test: {
    environment: "happy-dom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/components/**/*.{ts,tsx}", "src/forms/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/**/*.stories.{ts,tsx}",
        "src/**/index.ts",
        "src/**/*.d.ts",
        "src/components/article-hero/**",
        "src/components/article-stats/**",
        "src/components/box/**",
        "src/components/hero-image/**",
        "src/components/snippet/**",
        "src/components/toast/use-toast.ts",
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
