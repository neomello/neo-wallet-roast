import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // Stub React Native / optional peer deps for both webpack and Turbopack
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-native-async-storage/async-storage": false,
      "pino-pretty": false,
    };
    return config;
  },
  experimental: {
    turbo: {
      resolveAlias: {
        "@react-native-async-storage/async-storage": { browser: "./empty-module.js" },
        "pino-pretty": { browser: "./empty-module.js" },
      },
    },
  },
};

export default withBundleAnalyzer(nextConfig);
