/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    turbo: {
      rules: {
        '*.css': {
          loaders: ['postcss-loader'],
          as: '*.css',
        },
      },
    },
  },
  webpack: (config, { isServer }) => {
    // Fix for lightningcss on Vercel
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        'lightningcss': 'commonjs lightningcss',
      })
    }
    return config
  },
}

export default nextConfig
