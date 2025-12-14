import { GetServerSideProps } from "next";

const Sitemap = () => null;

// Canonical service slugs
const serviceSlugs = [
  "computer-repair",
  "custom-solutions",
  "data-recovery",
  "home-network-security",
  "network-setup",
  "onsite-tech-support",
  "password-management",
  "pc-upgrades",
  "scam-protection",
  "smart-home-setup",
  "software-troubleshooting",
  "virus-removal",
];

// Remote service slugs
const remoteSlugs = [
  "remote-privacy-hardening",
  "remote-security-assessment",
  "remote-support",
  "remote-tech-tutoring",
  "remote-training",
  "remote-virus-removal",
  "remote-support-plan",
];

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = "https://www.wedefendit.com";
  const now = new Date().toISOString();

  const staticPages = [
    { path: "", priority: "1.00" }, // homepage
    { path: "services", priority: "0.95" }, // primary money hub
    { path: "contact", priority: "0.90" }, // conversion page
    { path: "awareness", priority: "0.80" },
    { path: "about", priority: "0.70" },
    { path: "terms", priority: "0.30" },
    { path: "privacy", priority: "0.30" },
    { path: "thank-you", priority: "0.10" },
  ];

  const toUrlTag = (loc: string, priority = "0.70") =>
    `
    <url>
      <loc>${loc}</loc>
      <lastmod>${now}</lastmod>
      <priority>${priority}</priority>
    </url>`.trim();

  let urls = "";

  for (const { path, priority } of staticPages) {
    urls += toUrlTag(`${baseUrl}/${path}`, priority);
  }

  // Core service pages (highest-value content)
  for (const slug of serviceSlugs) {
    urls += toUrlTag(`${baseUrl}/services/${slug}`, "0.85");
  }

  // Remote services hub + children (secondary revenue)
  urls += toUrlTag(`${baseUrl}/services/remote`, "0.80");
  for (const slug of remoteSlugs) {
    urls += toUrlTag(`${baseUrl}/services/remote/${slug}`, "0.70");
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  res.write(xml);
  res.end();

  return { props: {} };
};

export default Sitemap;
