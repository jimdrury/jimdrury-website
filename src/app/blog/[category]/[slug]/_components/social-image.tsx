import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ImageResponseOptions } from "next/server";
import { cache } from "react";

export const socialImageSize = {
  width: 1200,
  height: 630,
};

export const socialImageContentType = "image/png";
export const socialImageAlt = "Featured article preview";

type SocialImagePayload = {
  title: string;
  excerpt: string;
  featuredImageUrl?: string;
};

type SocialImageFontOptions = NonNullable<ImageResponseOptions["fonts"]>;

const clamp = (value: string, maxLength: number): string => {
  const normalized = value.trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
};

export const toSocialImagePayload = ({
  title,
  excerpt,
  featuredImageUrl,
}: SocialImagePayload): SocialImagePayload => {
  return {
    title: clamp(title, 96),
    excerpt: clamp(excerpt, 180),
    featuredImageUrl,
  };
};

const getGeistFontData = cache(async (weight: 600 | 800 | 900) => {
  const fontFileByWeight: Record<600 | 800 | 900, string> = {
    600: "geist-latin-600-normal.woff",
    800: "geist-latin-800-normal.woff",
    900: "geist-latin-900-normal.woff",
  };

  const fontPath = join(
    process.cwd(),
    "node_modules",
    "@fontsource",
    "geist",
    "files",
    fontFileByWeight[weight],
  );

  try {
    const file = await readFile(fontPath);
    return file.buffer.slice(
      file.byteOffset,
      file.byteOffset + file.byteLength,
    );
  } catch {
    return null;
  }
});

export const getSocialImageFontOptions =
  async (): Promise<SocialImageFontOptions> => {
    const [semiBold, extraBold, black] = await Promise.all([
      getGeistFontData(600),
      getGeistFontData(800),
      getGeistFontData(900),
    ]);

    return [
      semiBold
        ? {
            name: "Geist",
            data: semiBold,
            style: "normal" as const,
            weight: 600 as const,
          }
        : null,
      extraBold
        ? {
            name: "Geist",
            data: extraBold,
            style: "normal" as const,
            weight: 800 as const,
          }
        : null,
      black
        ? {
            name: "Geist",
            data: black,
            style: "normal" as const,
            weight: 900 as const,
          }
        : null,
    ].filter((font): font is NonNullable<typeof font> => Boolean(font));
  };

export const SocialImage = ({
  title,
  excerpt,
  featuredImageUrl,
}: SocialImagePayload) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "linear-gradient(120deg, #0f172a, #111827 50%, #1f2937)",
        color: "#f9fafb",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Geist, sans-serif",
      }}
    >
      {featuredImageUrl && (
        // biome-ignore lint/performance/noImgElement: next/og ImageResponse renders with standard img tags.
        <img
          src={featuredImageUrl}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.35) 45%, rgba(0, 0, 0, 0.72))",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 32,
          left: 32,
          display: "flex",
          padding: "10px 16px",
          background: "#ffeb3b",
          border: "4px solid #000",
          color: "#000",
          fontSize: 22,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          boxShadow: "8px 8px 0 #000",
        }}
      >
        Jim Drury
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          maxWidth: "1080px",
          marginTop: "80px",
          marginLeft: "40px",
          marginRight: "40px",
          flexDirection: "column",
          gap: "20px",
          padding: "34px 38px",
          background: "rgba(255, 255, 255, 0.96)",
          border: "6px solid #000",
          color: "#111827",
          boxShadow: "14px 14px 0 rgba(0, 0, 0, 0.9)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 62,
            fontWeight: 900,
            lineHeight: 1.04,
            textWrap: "balance",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            fontWeight: 600,
            lineHeight: 1.2,
            color: "#374151",
          }}
        >
          {excerpt}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 32,
          bottom: 28,
          display: "flex",
          padding: "8px 14px",
          background: "#00e5ff",
          border: "4px solid #000",
          color: "#000",
          fontSize: 20,
          fontWeight: 800,
          boxShadow: "6px 6px 0 #000",
        }}
      >
        Article
      </div>
    </div>
  );
};
