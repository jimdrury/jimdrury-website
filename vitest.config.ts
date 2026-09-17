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
    include: ["src/**/*.spec.{ts,tsx}", "schema/**/*.spec.ts"],
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "src/bloks/ArticleBlok.tsx",
        "src/bloks/PageBlok.tsx",
        "src/components/accordion/**/*.{ts,tsx}",
        "src/components/blog-card/**/*.{ts,tsx}",
        "src/components/button/**/*.{ts,tsx}",
        "src/components/divider/**/*.{ts,tsx}",
        "src/components/footer/**/*.{ts,tsx}",
        "src/components/header/**/*.{ts,tsx}",
        "src/components/icon/**/*.{ts,tsx}",
        "src/components/link/**/*.{ts,tsx}",
        "src/components/media/**/*.{ts,tsx}",
        "src/components/modal/**/*.{ts,tsx}",
        "src/components/page-header/**/*.{ts,tsx}",
        "src/components/section/**/*.{ts,tsx}",
        "src/components/status-band/**/*.{ts,tsx}",
        "src/components/surface/**/*.{ts,tsx}",
        "src/components/ticker/**/*.{ts,tsx}",
        "src/components/typography/**/*.{ts,tsx}",
      ],
      exclude: [
        "src/**/*.spec.{ts,tsx}",
        "src/**/*.stories.{ts,tsx}",
        "src/**/index.ts",
        "src/**/*.d.ts",
        "src/components/header/header-nav-links.tsx",
        "src/components/media/media-lightbox.tsx",
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
