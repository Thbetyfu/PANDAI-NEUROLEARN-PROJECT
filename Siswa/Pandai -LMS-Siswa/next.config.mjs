/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Kurangi overhead render saat dev
  swcMinify: true,        // Gunakan SWC yang sangat cepat
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // Pertahankan kompilasi lebih lama (60 detik)
    pagesBufferLength: 2,      // Jangan simpan terlalu banyak halaman di memori
  },
  // Optimasi memory untuk laptop 8GB
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  }
};

export default nextConfig;
