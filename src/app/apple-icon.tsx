import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const AppleIcon = () => {
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
        fontSize: 92,
        fontWeight: 500,
        color: "#1e1e1e",
      }}
    >
      jd
    </div>,
    { ...size },
  );
};

export default AppleIcon;
