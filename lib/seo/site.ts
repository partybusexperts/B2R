export const siteConfig = {
  name: "Bus2Ride",
  description:
    "Premium party buses, limos, and coach buses — clean rides, pro drivers, and fast quotes.",
  defaultLocale: "en_US",
} as const;

export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`.replace(/\/+$/, "");

  return "http://localhost:3000";
}

export function absoluteUrl(path: string) {
  const base = getSiteUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
