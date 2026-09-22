import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Reaching the dev server from another machine on the LAN or over Tailscale:
  // without these, Next blocks /_next/* and the page loads unstyled and dead.
  allowedDevOrigins: ['192.168.1.57', '100.106.14.43', '*.local'],
};

export default withMDX(config);
