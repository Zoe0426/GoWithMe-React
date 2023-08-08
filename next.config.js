/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    //平常開發使用本端
    // API_SERVER: 'http://localhost:3002',
    // WEB: 'http://localhost:3000',
    //發表時使用
    API_SERVER: 'http://192.168.24.183:3002',
    WEB: 'http://192.168.24.183:3000',
    // API_SERVER: 'http://192.168.1.102:3002',
    // WEB: 'http://192.168.1.102:3000',
  },
  images: {
    domains: ['via.placeholder.com', 'localhost'],
  },
  // avoid cors with proxy
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'http://localhost:3005/:path*', // Proxy to Backend
  //     },
  //   ]
  // },
};

module.exports = nextConfig;
