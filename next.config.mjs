/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    loader: 'custom',
    // `pcg build` 启动时把 @ali/pcg-cli 自带的 loader 复制到
    // node_modules/.pcg/ 下,项目根 / package.json 都不需要改。
    loaderFile: 'node_modules/.pcg/pcg-image-loader.js',
  },
};

export default nextConfig;
