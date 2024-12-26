import type { NextConfig } from "next";

const withPWA = require('next-pwa');

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default pwaConfig(nextConfig);
