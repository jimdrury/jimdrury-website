import { ImageResponse } from "next/og";
import { brandAccent } from "@/lib/brand-accent";

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
        background: brandAccent,
        borderRadius: 4,
        fontFamily: "Inter",
        fontSize: 18,
        fontWeight: 900,
        color: "#000000",
      }}
    >
      jd
    </div>,
    { ...size },
  );
};

export default Icon;
