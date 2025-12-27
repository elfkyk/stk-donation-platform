import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bu ayar Vercel'e "Iyzipay'i sıkıştırma, olduğu gibi bırak" der.
  serverExternalPackages: ["iyzipay"], 
};

export default nextConfig;