/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.

This software and its source code are the proprietary property of
Defend I.T. Solutions LLC and are protected by United States and
international copyright laws. Unauthorized reproduction, distribution,
modification, display, or use of this software, in whole or in part, without the
prior written permission of Defend I.T. Solutions LLC, is strictly prohibited.

This software is provided for use only by authorized employees, contractors, or
licensees of Defend I.T. Solutions LLC and may not be disclosed to any third
party without express written consent.
*/

import companyInfo from "@/data/company-info.json";

const { name, contact } = companyInfo;
const { phone, email, address } = contact;
const { street, city, state, zip } = address;

export const localBusinessLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.wedefendit.com/#organization",
  name,
  image: "https://www.wedefendit.com/og-image.png",
  logo: "https://www.wedefendit.com/logo.svg",
  url: "https://www.wedefendit.com/",
  telephone: phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: street,
    addressLocality: city,
    addressRegion: state,
    postalCode: zip,
    addressCountry: "US",
  },
  areaServed: [
    "Ocala",
    "Belleview",
    "The Villages",
    "Central Florida",
    "Remote",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    telephone: phone,
    email: email,
    areaServed: "US",
    availableLanguage: "English",
  },
};

export type Crumb = {
  name: string;
  href?: string; // omit for the current page
};

export type GenBreadCrumbsLdProps = {
  items: Crumb[]; // ordered left→right; last is current page,
  baseUrl?: string; // e.g., "https://www.wedefendit.com"
};

export function generateBreadCrumbJsonLd({
  items,
  baseUrl = "https://www.wedefendit.com",
}: GenBreadCrumbsLdProps): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.href ? { item: `${baseUrl}${item.href}` } : {}),
    })),
  };
}

export type ServiceLdProps = {
  name: string;
  description: string;
  url: string;
  image: string;
  keywords?: string[];
  city?: string;
  provider?: {
    "@type": string; // e.g., "Organization"
    name: string;
  };
  offers?: {
    "@type": string; // e.g., "Offer"
    itemOffered?: {
      "@type": string; // e.g., "Service"
      name: string;
      description: string;
    };
  }[];
};

export function generateServiceLd({
  name,
  url,
  image,
  city = "",
  offers = [],
  description,
  keywords = [],
  provider = { "@type": "Organization", name: "Defend I.T. Solutions" },
}: ServiceLdProps): object {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    url,
    image,
    provider,
    description,
    keywords: keywords.join(", "),
    areaServed: city ? [`${city} FL`, "Central Florida"] : ["Central Florida"],
    offers: offers.map((offer) => ({
      "@type": "Offer",

      itemOffered: {
        "@type": "Service",
        name: offer.itemOffered?.name || name,
        description: offer.itemOffered?.description || description,
      },
    })),
  };
}
export function generateRelatedServiceLd(
  services: { label: string; slug: string }[],
  isRemote: boolean = false,
): object {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: r.label,
      url: isRemote
        ? `https://www.wedefendit.com/services/remote/${r.slug}`
        : `https://www.wedefendit.com/services/${r.slug}`,
    })),
  };
}

export function generateFAQPageLd(
  questions: { name: string; acceptedAnswer: string }[],
): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.name,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.acceptedAnswer,
      },
    })),
  };
}

export const sigintProductLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SIGINT Dashboard",
  alternateName: "SIGINT Dashboard™",
  applicationCategory: "SecurityApplication",
  applicationSubCategory: "OSINT Intelligence Platform",
  operatingSystem: "Web, Windows, macOS, Linux",
  url: "https://www.wedefendit.com/sigint",
  image: "https://www.wedefendit.com/sigint-og.png",
  screenshot: "https://www.wedefendit.com/sigint-hero.png",
  description:
    "Real-time OSINT dashboard with live aircraft, vessel, seismic, fire, weather, and conflict event tracking on an interactive globe. Correlation engine, anomaly detection, and multi-source intelligence analysis.",
  featureList: [
    "Live aircraft tracking (OpenSky Network)",
    "AIS vessel tracking",
    "USGS seismic monitoring",
    "NASA FIRMS fire detection",
    "NOAA severe weather alerts",
    "GDELT conflict and crisis events",
    "World news aggregation (RSS)",
    "Cross-source correlation engine",
    "Anomaly detection with regional baselines",
    "Interactive globe and flat map projections",
    "Multi-pane resizable layout",
    "Live HLS video monitoring",
    "Entity dossier with photos and intel links",
    "Composite alert scoring (1-10)",
    "Watch mode (automated globe tour)",
    "Global search with live filtering",
    "Dark and light themes",
    "PWA installable",
    "JSON data export",
  ],
  author: {
    "@type": "Organization",
    name: "Defend I.T. Solutions LLC",
    url: "https://www.wedefendit.com",
  },
  provider: {
    "@type": "Organization",
    name: "Defend I.T. Solutions LLC",
    url: "https://www.wedefendit.com",
  },
  offers: [
    {
      "@type": "Offer",
      name: "Community",
      description:
        "Free, self-hosted. All data sources, correlation engine, all pane types, 7-day rolling window.",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: "https://www.wedefendit.com/sigint#pricing",
    },
    {
      "@type": "Offer",
      name: "Pro",
      description:
        "Hosted service with desktop app, persistent database, geofenced alerts, custom alert rules, 90-day history, and MCP support.",
      price: "29",
      priceCurrency: "USD",
      priceValidUntil: "2027-12-31",
      billingIncrement: "P1M",
      availability: "https://schema.org/PreOrder",
      url: "https://www.wedefendit.com/sigint#pricing",
    },
  ],
  softwareVersion: "1.0",
  license: "https://www.wedefendit.com/sigint#pricing",
  isAccessibleForFree: true,
};
