import type { NextConfig } from "next";

const repoName = "travel-vaccine-checker";
const isGithubActions = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGithubActions ? `/${repoName}` : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
