import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import { siteConfig } from "./src/site.config";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const s3PublicUrl = process.env.NEXT_PUBLIC_S3_PUBLIC_URL || "";
const s3Url = s3PublicUrl ? new URL(s3PublicUrl) : null;
const s3Hostname = s3Url ? s3Url.hostname : "";
const s3Protocol = s3Url ? s3Url.protocol.replace(":", "") : "https";

const useCloudflareLoader = siteConfig.imageLoader === "cloudflare";

const nextConfig: NextConfig = {
  ...(process.env.VERCEL !== "1" && {
    output: "standalone",
  }),
  /* config options here */
  reactCompiler: true,
  images: {
    qualities: [65, 75],
    // The endpoint independently validates its `key` to `projects/` image
    // objects before reading from R2. Query parameters are required for that
    // allowlisted key, so permit this one same-origin image path.
    localPatterns: [
      {
        pathname: "/api/media",
      },
      {
        pathname: "/**",
      },
    ],
    ...(useCloudflareLoader && {
      loader: "custom",
      loaderFile: "./src/lib/cloudflare-image-loader.ts",
    }),
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
      ...(s3Hostname
        ? [
            {
              protocol: s3Protocol as "http" | "https",
              hostname: s3Hostname,
              port: s3Url?.port || "",
            },
          ]
        : []),
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
