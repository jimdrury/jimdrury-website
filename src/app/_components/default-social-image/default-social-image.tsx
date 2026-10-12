import type { FC } from "react";

export const defaultSocialImageSize = {
  width: 1200,
  height: 630,
};

export const defaultSocialImageContentType = "image/png";
export const defaultSocialImageAlt = "Jim Drury";

export const DefaultSocialImage: FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#fefefe",
        color: "#1e1e1e",
        padding: "56px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignSelf: "flex-start",
          padding: "12px 18px",
          background: "#f386a1",
          border: "1px solid #1e1e1e",
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "-0.03em",
        }}
      >
        Jim Drury
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          maxWidth: "920px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
          }}
        >
          Head of Platform Innovation
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            fontWeight: 600,
            lineHeight: 1.25,
            color: "#374151",
          }}
        >
          Next.js, TypeScript, and agentic engineering
        </div>
      </div>
    </div>
  );
};
