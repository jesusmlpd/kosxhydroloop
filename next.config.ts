import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El panel se reordeno: las direcciones viejas siguen llevando al lugar correcto.
  async redirects() {
    return [
      { source: "/admin/reportes", destination: "/admin/marketing/meta", permanent: false },
      { source: "/admin/recuperacion", destination: "/admin/marketing/correos", permanent: false },
      { source: "/admin/marketing", destination: "/admin/marketing/meta", permanent: false },
    ];
  },
};

export default nextConfig;
