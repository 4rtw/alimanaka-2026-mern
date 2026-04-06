/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    API_URL: process.env.API_URL || 'https://alimanaka.chantilly-shaula.ts.net:8443/api',
  },
}

module.exports = nextConfig
