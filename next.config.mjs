/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Ignore build errors in Next.js internal generated stub files
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
