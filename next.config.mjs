/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  // Allow larger request bodies for plant image uploads (default is 1 MB)
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
