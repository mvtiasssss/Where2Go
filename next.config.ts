import type { NextConfig } from "next";

// Cache para imágenes locales en /public (marcadores de Leaflet y fotos semilla).
// Conservador a propósito: NO immutable, porque estas rutas no llevan hash de
// contenido y un redeploy reusa la misma URL; con max-age + SWR un cambio de
// imagen se ve, como mucho, ~1 h después. No tocamos HTML ni /_next/static
// (Next ya cachea los assets hasheados de forma inmutable).
const CACHE_ASSETS = "public, max-age=3600, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/venues/:path*", headers: [{ key: "Cache-Control", value: CACHE_ASSETS }] },
      { source: "/leaflet/:path*", headers: [{ key: "Cache-Control", value: CACHE_ASSETS }] },
    ];
  },
};

export default nextConfig;
