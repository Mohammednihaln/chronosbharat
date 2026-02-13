import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGitHubPages ? "/chronosbharat" : "",
  assetPrefix: isGitHubPages ? "/chronosbharat/" : "",
  images: {
    unoptimized: true,
  },
  devIndicators: false,
};

export default nextConfig;
