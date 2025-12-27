// import type { NextConfig } from "next";

const nextConfig = {
  // BURASI ÖNEMLİ: İkisini de listeye ekledik
  serverExternalPackages: ["iyzipay", "postman-request"],

  experimental: {
    outputFileTracingIncludes: {
      '/api/payment': ['./node_modules/iyzipay/**/*']
    }
  }
};

export default nextConfig;