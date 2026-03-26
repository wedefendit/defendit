// next.config.js

/** @type {import('next').NextConfig} */

const baseCsp = [
  "default-src 'self'",
  "img-src 'self' data: blob: https://tile.openstreetmap.org https://a.tile.openstreetmap.org https://b.tile.openstreetmap.org https://c.tile.openstreetmap.org https://unpkg.com",
  "script-src 'self' https://www.google.com https://www.gstatic.com",
  "script-src-elem 'self' https://www.google.com https://www.gstatic.com",
  "style-src 'self'",
  "font-src 'self'",
  "frame-src 'self' https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "connect-src 'self' https://tile.openstreetmap.org https://a.tile.openstreetmap.org https://b.tile.openstreetmap.org https://c.tile.openstreetmap.org https://www.google.com",
  "frame-ancestors 'self'",
].join("; ");

const captchaCsp = [
  "default-src 'self'",
  "img-src 'self' data: blob: https://tile.openstreetmap.org https://a.tile.openstreetmap.org https://b.tile.openstreetmap.org https://c.tile.openstreetmap.org https://unpkg.com",
  "script-src 'self' https://www.google.com https://www.gstatic.com",
  "script-src-elem 'self' https://www.google.com https://www.gstatic.com",
  "style-src 'self'",
  "style-src-attr 'unsafe-inline'",
  "font-src 'self'",
  "frame-src 'self' https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "connect-src 'self' https://tile.openstreetmap.org https://a.tile.openstreetmap.org https://b.tile.openstreetmap.org https://c.tile.openstreetmap.org https://www.google.com",
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = (csp: string) => [
  { key: "Content-Security-Policy", value: csp },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig = {
  devIndicators: false,
  async headers() {
    return [
      {
        source: "/contact",
        headers: securityHeaders(captchaCsp),
      },
      {
        source: "/sigint",
        headers: securityHeaders(captchaCsp),
      },
      {
        source: "/:path*",
        headers: securityHeaders(baseCsp),
      },
    ];
  },
};

export default nextConfig;
