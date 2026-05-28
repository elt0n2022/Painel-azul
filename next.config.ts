import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Adicione a configuração aqui:
  allowedDevOrigins: ['192.168.56.1', 'localhost:3000'],
};

export default nextConfig;