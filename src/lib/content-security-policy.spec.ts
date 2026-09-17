import { describe, expect, it } from "vitest";
import { buildContentSecurityPolicy } from "./content-security-policy";

describe("buildContentSecurityPolicy", () => {
  const productionPolicy = buildContentSecurityPolicy({ isDevelopment: false });
  const developmentPolicy = buildContentSecurityPolicy({ isDevelopment: true });

  it("defaults to self and allowlists Storyblok plus image CDNs", () => {
    expect(productionPolicy).toContain("default-src 'self'");
    expect(productionPolicy).toContain("https://a.storyblok.com");
    expect(productionPolicy).toContain("https://img2.storyblok.com");
    expect(productionPolicy).toContain("https://app.storyblok.com");
    expect(productionPolicy).toContain("https://api.storyblok.com");
  });

  it("allows the Visual Editor to frame the site", () => {
    expect(productionPolicy).toContain(
      "frame-ancestors 'self' https://app.storyblok.com https://app.eu.storyblok.com https://plugin.storyblok.com",
    );
  });

  it("does not allow eval in production", () => {
    expect(productionPolicy).not.toContain("'unsafe-eval'");
    expect(developmentPolicy).toContain("'unsafe-eval'");
  });

  it("is applied from next.config headers", async () => {
    const nextConfig = (await import("../../next.config")).default;
    const headers = await nextConfig.headers?.();
    const csp = headers
      ?.flatMap((entry) => entry.headers)
      .find((header) => header.key === "Content-Security-Policy");

    expect(csp?.value).toBe(productionPolicy);
  });
});
