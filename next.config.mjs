/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    swcPlugins: [["next-superjson-plugin", {}]],
  },
};

export default nextConfig;
