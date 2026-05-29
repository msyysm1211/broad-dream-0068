/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    loader: 'custom',
    loaderFile: './pcg-image-loader.js',
  },
};

export default nextConfig;
