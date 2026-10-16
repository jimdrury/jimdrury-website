import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const Icon = () => {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f386a1",
        borderRadius: 0,
        fontFamily: "Inter",
        fontSize: 16,
        fontWeight: 500,
        color: "#1e1e1e",
      }}
    >
      jd
    </div>,
    { ...size },
  );
};

export default Icon;
