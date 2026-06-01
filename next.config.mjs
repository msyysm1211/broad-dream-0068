import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    loader: 'custom',
    loaderFile: require.resolve('@ali/pcg-cli/runtime/pcg-image-loader.js'),
  },
};

export default nextConfig;
