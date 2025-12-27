import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Iyzico kütüphanesini Turbopack hatasından korumak için buraya ekliyoruz
  serverExternalPackages: ['iyzipay'],
};

export default nextConfig;