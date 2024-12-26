import type { NextConfig } from "next";
const withPWA = require('next-pwa');

const config: NextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

export default config;
