// import type { NextConfig } from "next"; <-- Bunu sildik veya yorum satırı yaptık

const nextConfig = {
  // 1. Iyzipay'i dış paket olarak işaretle
  serverExternalPackages: ["iyzipay"],

  // 2. Dosyaları zorla dahil et
  experimental: {
    outputFileTracingIncludes: {
      '/api/payment': ['./node_modules/iyzipay/**/*']
    }
  }
};

export default nextConfig;