import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages — produces ./out on `npm run build`
  output: "export",

  // GitHub Pages serves files literally — no on-demand image optimization
  images: { unoptimized: true },

  // Cleaner URL paths on GH Pages (e.g. /work/airbnb-friendly-tools/)
  trailingSlash: true,
};

export default nextConfig;
