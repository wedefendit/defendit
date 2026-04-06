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

import {
  generateBreadCrumbJsonLd,
  generateFAQPageLd,
  generateRelatedServiceLd,
  generateServiceLd,
  localBusinessLd,
} from "@/lib/json-ld";
import Link from "next/link";
import { Lightbulb } from "lucide-react";
import * as Icons from "lucide-react";
import {
  PageContainer,
  Meta,
  BookOnline,
  BreadCrumbs,
  FaqSection,
} from "@/components";

export type ServiceContent = {
  id: string;
  title: string;
  headline: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  url: string;
  image: string;
  requiresPlan?: boolean;
  icons?: string[];
  serviceArea?: string[];
  internalLinks?: { label: string; slug: string }[];
  faq?: {
    question: string;
    answer: string;
  }[];
  sections: {
    heading: string;
    paragraph?: string | string[];
    items?: string[];
  }[];
};

export type ServiceSlugProps = {
  service: ServiceContent;
  related?: { label: string; slug: string }[];
  remote?: boolean;
};

export function ServiceSlug({ service, related, remote }: ServiceSlugProps) {
  const [first, ...rest] = service.sections;
  const isRemote = remote || false;
  const internalLinks =
    service.internalLinks && service.internalLinks.length > 0
      ? service.internalLinks
      : related;

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Services", href: !remote ? "/services" : "/services/remote" },
    { name: service.title },
  ];

  const breadcrumbLd = generateBreadCrumbJsonLd({
    items: crumbs,
    baseUrl: "https://www.wedefendit.com",
  });

  const serviceLd = generateServiceLd({
    name: service.title,
    image: service.image,
    keywords: service.keywords,
    description: service.metaDescription || service.description,
    url: `https://www.wedefendit.com${service.url}`,
    areaServed: service.serviceArea,
    provider: { "@type": "Organization", name: "Defend I.T. Solutions" },
    offers: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.description,
        },
      },
    ],
  });

  const faqLd =
    service.faq && service.faq.length > 0
      ? generateFAQPageLd(
          service.faq.map((item) => ({
            name: item.question,
            acceptedAnswer: item.answer,
          })),
        )
      : null;

  const relatedServicesLd =
    internalLinks && internalLinks.length > 0
      ? generateRelatedServiceLd(internalLinks, isRemote)
      : null;

  const hasDYK =
    typeof first?.heading === "string" &&
    first.heading.toLowerCase().includes("did you know");
  const sections = hasDYK ? rest : service.sections;

  const canonical = `https://www.wedefendit.com${service.url}`;
  const metaTitle = service.metaTitle || `${service.title} | Defend I.T. Solutions`;
  const metaDescription = service.metaDescription || service.description;
  const structuredGraph = [
    breadcrumbLd,
    serviceLd,
    localBusinessLd,
    ...(relatedServicesLd ? [relatedServicesLd] : []),
    ...(faqLd ? [faqLd] : []),
  ];

  return (
    <>
      <Meta
        title={metaTitle}
        description={metaDescription}
        image={service.image}
        imageAlt={`${service.title} — Defend I.T. Solutions`}
        url={canonical}
        canonical={canonical}
        keywords={service.keywords.join(", ")}
        structuredData={{ "@graph": structuredGraph }}
      />

      <PageContainer>
        <div className="max-w-4xl mx-auto py-8 sm:py-10 space-y-6 sm:space-y-7 px-4 sm:px-6 text-left rounded-lg shadow-lg bg-gray-50/10 dark:bg-slate-950/20 z-0">
          <BreadCrumbs items={crumbs} baseUrl="https://www.wedefendit.com" />

          {/* Hero Section with Icons */}
          <div className="flex flex-col sm:flex-row items-start gap-6 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-slate-900 dark:to-slate-800 rounded-lg p-6 border border-blue-200 dark:border-sky-800">
            {/* Icons */}
            {service.icons && service.icons.length > 0 && (
              <div className="flex items-center gap-3 flex-shrink-0">
                {service.icons.map((iconName, idx) => {
                  const name = iconName
                    .split("-")
                    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
                    .join("");
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const LucideIcon = (Icons as any)[name];
                  return LucideIcon ? (
                    <div
                      key={idx}
                      className="w-16 h-16 rounded-full bg-blue-100 dark:bg-sky-900/30 flex items-center justify-center"
                    >
                      <LucideIcon className="w-8 h-8 text-blue-600 dark:text-sky-400" />
                    </div>
                  ) : null;
                })}
              </div>
            )}

            {/* Text Content */}
            <div className="flex-1 space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                {service.title}
              </h1>
              <p className="text-base sm:text-lg text-blue-600 dark:text-sky-400">
                {service.headline}
              </p>
            </div>
          </div>

          {hasDYK && (
            <div className="mt-4 rounded-lg border border-yellow-600/30 bg-yellow-500/10 dark:bg-yellow-700/20 p-4 sm:p-5">
              <h2 className="text-lg sm:text-xl font-semibold text-yellow-900 dark:text-yellow-100 inline-flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-yellow-400" />
                {first!.heading}
              </h2>
              {Array.isArray(first!.paragraph) ? (
                <div className="mt-2 space-y-2">
                  {first!.paragraph.map((t, i) => (
                    <p
                      key={i}
                      className="text-sm sm:text-base text-yellow-900/90 dark:text-yellow-50"
                    >
                      {t}
                    </p>
                  ))}
                </div>
              ) : (
                first!.paragraph && (
                  <p className="mt-2 text-sm sm:text-base text-yellow-900/90 dark:text-yellow-50">
                    {first!.paragraph}
                  </p>
                )
              )}
            </div>
          )}

          {sections.map((section, idx) => (
            <section
              key={idx}
              className="pt-6 sm:pt-8 first:pt-0 border-t border-gray-200/60 dark:border-gray-700/60 first:border-t-0"
            >
              <h2 className="text-2xl font-semibold">{section.heading}</h2>

              {section.paragraph &&
                (Array.isArray(section.paragraph) ? (
                  <div className="mt-2 space-y-2">
                    {section.paragraph.map((text, i) => (
                      <p
                        key={i}
                        className="text-gray-700 dark:text-gray-300 text-sm sm:text-base"
                      >
                        {text}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                    {section.paragraph}
                  </p>
                ))}

              {section.items && (
                <ul className="mt-3 list-disc pl-5 sm:pl-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base space-y-2 marker:text-sky-500 dark:marker:text-sky-400">
                  {section.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {service.faq && service.faq.length > 0 && (
            <FaqSection items={service.faq} />
          )}

          {service.requiresPlan && (
            <div className="mt-6 rounded-lg border border-sky-400/30 bg-sky-100/40 dark:bg-sky-900/20 p-4 sm:p-5 text-sky-900 dark:text-sky-100 text-sm flex flex-col items-center">
              <span>
                This service is available exclusively to Remote Service Plan
                members.
              </span>
              <Link
                href="/services/remote/remote-support-plan"
                className="inline-block mt-2 px-3 py-1.5 rounded border border-sky-300 dark:border-sky-700 bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-medium hover:underline transition"
              >
                Learn more
              </Link>
            </div>
          )}

          {/* What to Expect Section */}
          <section className="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-slate-900 dark:to-slate-800 rounded-lg p-6 sm:p-8 border border-blue-200 dark:border-sky-800">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
              What to Expect
            </h2>

            <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-blue-600 dark:bg-sky-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                  1
                </div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  Contact Us
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Call, text, or book online—we&apos;ll respond quickly
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-blue-600 dark:bg-sky-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                  2
                </div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  We Assess
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Clear diagnosis with upfront pricing, no surprises
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-blue-600 dark:bg-sky-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                  3
                </div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  Get Fixed
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Fast, reliable service with no unnecessary upsells
                </p>
              </div>
            </div>
          </section>

          <div className="mt-10 w-full flex flex-col items-stretch sm:items-center justify-center gap-6 sm:gap-8 text-left sm:text-center">
            <div className="w-full">
              <BookOnline />
            </div>

            {internalLinks && internalLinks.length > 0 && (
              <nav
                aria-label="Related services"
                className="text-sm text-gray-700 dark:text-gray-300 max-w-full overflow-x-auto px-0 sm:px-1 mt-2"
              >
                <h3 className="mb-3 text-lg font-semibold text-blue-700 dark:text-sky-300">
                  Related services:
                </h3>
                <ul className="flex flex-wrap items-stretch sm:items-center justify-start sm:justify-center gap-2 max-w-full">
                  {internalLinks.map((r) => (
                    <li key={r.slug} className="w-full sm:w-auto">
                      <Link
                        href={`/services/${
                          isRemote ? `remote/${r.slug}` : r.slug
                        }`}
                        className="w-full sm:w-auto inline-block rounded-lg border border-sky-300 dark:border-sky-700 px-4 py-2 bg-gray-50 dark:bg-slate-900 text-sky-700 dark:text-sky-300 font-medium hover:bg-sky-50 dark:hover:bg-sky-800/30 transition whitespace-normal text-center"
                      >
                        {r.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            <div className="flex flex-wrap items-stretch sm:items-center justify-start sm:justify-center gap-3 text-sm">
              <Link
                href={isRemote ? "/services/remote" : "/services"}
                className="w-full sm:w-auto inline-block rounded-lg border border-sky-300 dark:border-sky-700 px-4 py-2 bg-gray-50 dark:bg-slate-900 text-sky-700 dark:text-sky-300 font-medium hover:bg-sky-100 dark:hover:bg-sky-900/40 transition whitespace-normal text-center"
              >
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
