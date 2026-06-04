import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  webpack: (config) => {
    config.externals.push(
      "pino-pretty", "lokijs", "encoding", "accounts", "porto/internal", "porto",
      "@coinbase/wallet-sdk", "@metamask/connect-evm"
    );
    return config;
  },
};
export default nextConfig;
