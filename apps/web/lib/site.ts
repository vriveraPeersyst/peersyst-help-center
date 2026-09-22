/** Absolute origin of the deployed site, for the sitemap and the agent feed. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined) ??
  'http://localhost:3000'
).replace(/\/+$/, '');
