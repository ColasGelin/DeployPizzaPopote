/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '64.226.114.142',
        port: '3443',
        pathname: '/uploads/**',
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/images',
          outputPath: 'static/images/',
        },
      },
    });
    return config;
  },
  // Add this rewrites configuration
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://64.226.114.142:3001/api/:path*'
      }
    ]
  }
};

export default nextConfig;