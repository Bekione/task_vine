import type { NextConfig } from "next";
const withPWA = require('next-pwa');

const config: NextConfig = {
  // Your other Next.js config options here if needed
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  fallbacks: {
    document: '/offline'
  }
})(config);
