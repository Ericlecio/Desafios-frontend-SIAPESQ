import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export", // Habilita exportação estática
  images: {
    unoptimized: true, // Evita problemas com <Image />
  },
};

export default nextConfig;
