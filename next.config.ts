import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  typescript: {
    tsconfigPath: isProd ? "tsconfig.build.json" : "tsconfig.json",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "a.storyblok.com",
      },
    ],
  },
};

export default nextConfig;
