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
    name: "Services | Defend I.T. Solutions",
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

  const metaWithStructured = {
    ...meta,
    url: canonical,
    canonical,
    structuredData: {
      "@graph": [breadcrumbLd, servicesCollectionLd, localBusinessLd],
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
          <header className="text-center">
            <h1 className="text-4xl font-bold">{h1}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
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
