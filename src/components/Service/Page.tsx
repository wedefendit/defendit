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

import Link from "next/link";
import {
  Meta,
  BreadCrumbs,
  PageContainer,
  RemoteServicesCTA,
  ServiceAreaAndBooking,
} from "@/components";
import { ServiceCard } from "@/components/Service/Card";
import { localBusinessLd } from "@/lib/json-ld";

export type Service = {
  id: string;
  title: string;
  headline: string;
  icons: string[];
  summary: string;
  cta: string;
  slug?: string;
};

export type ServicesPageProps = {
  h1: string;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta: any;
  services: Service[];
  remote?: boolean;
};

function toSlug(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ServicePage(props: ServicesPageProps) {
  const { meta, h1, services, remote } = props;
  const isRemote = remote || false;

  const canonical = isRemote
    ? "https://www.wedefendit.com/services/remote"
    : "https://www.wedefendit.com/services";

  // ── JSON-LD ────────────────────────────────────────────────────────────────
  const breadcrumbLd = isRemote
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.wedefendit.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: "https://www.wedefendit.com/services",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Remote Services",
            item: canonical,
          },
        ],
      }
    : {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.wedefendit.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: canonical,
          },
        ],
      };

  const servicesCollectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: meta.title || "Services | Defend I.T. Solutions",
    description: meta.description,
    url: canonical,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: services.map((s, i) => {
        const slug = s.slug || s.id || toSlug(s.title);
        const url = `https://www.wedefendit.com/services/${
          isRemote ? `remote/${slug}` : slug
        }`;
        return {
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Service",
            name: s.title,
            description: s.summary || undefined,
            url,
            provider: { "@id": "https://www.wedefendit.com/#organization" },
          },
        };
      }),
    },
  };

  const existingStructuredData = meta?.structuredData;
  const existingGraph = existingStructuredData
    ? Array.isArray(existingStructuredData["@graph"])
      ? existingStructuredData["@graph"]
      : [existingStructuredData]
    : [];

  const metaWithStructured = {
    ...meta,
    url: canonical,
    canonical,
    structuredData: {
      "@graph": [
        ...existingGraph,
        breadcrumbLd,
        servicesCollectionLd,
        localBusinessLd,
      ],
    },
  };

  return (
    <>
      <Meta {...metaWithStructured} />

      <PageContainer>
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-10 bg-gray-50/10 dark:bg-slate-950/20 z-0 shadow-md">
          <BreadCrumbs
            includeJsonLd={false}
            items={
              isRemote
                ? [
                    { name: "Home", href: "/" },
                    { name: "Services", href: "/services" },
                    { name: "Remote Services", href: canonical },
                  ]
                : [
                    { name: "Home", href: "/" },
                    { name: "Services", href: canonical },
                  ]
            }
            baseUrl="https://www.wedefendit.com"
          />

          {/* Header */}
          <header className="text-center space-y-4 py-8 px-4 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-slate-900 dark:to-slate-800 rounded-lg border border-blue-200 dark:border-sky-800 shadow-sm">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-sky-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-sky-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Serving Central Florida
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
              {h1}
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Professional cybersecurity and I.T. support for homeowners,
              retirees, and small businesses.
            </p>
          </header>

          {/* Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service: Service) => (
              <ServiceCard
                key={service.id}
                {...service}
                remote={isRemote}
                slug={service.slug || service.id || toSlug(service.title)}
              />
            ))}
          </div>

          <RemoteServicesCTA isRemote={isRemote} />
          <ServiceAreaAndBooking />

          <section className="text-sm text-gray-600 dark:text-gray-400 italic text-center max-w-3xl mx-auto">
            <p>
              Not seeing the service you need? We offer additional I.T.
              solutions beyond what&apos;s listed here.{" "}
              <Link
                href="/contact"
                className="text-blue-600 dark:text-sky-400 hover:underline"
              >
                Contact us
              </Link>{" "}
              to discuss your needs.
            </p>
          </section>
        </div>
      </PageContainer>
    </>
  );
}

export { ServicePage };
