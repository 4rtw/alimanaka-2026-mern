/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Don't bake API_URL at build time — use runtime process.env directly in api.js
}

module.exports = nextConfig
