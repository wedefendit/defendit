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
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/78 px-6 py-8 shadow-[0_18px_40px_rgba(15,23,42,0.08)] ring-1 ring-white/75 backdrop-blur-md dark:border-sky-400/18 dark:bg-slate-950/78 dark:shadow-[0_24px_60px_rgba(2,6,23,0.42)] dark:ring-white/5">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_54%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_52%)]" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-24 w-52 -translate-x-1/2 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-400/16" />
            <div className="relative space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/60 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-700 shadow-[0_8px_20px_rgba(56,189,248,0.12)] backdrop-blur-sm dark:border-sky-400/18 dark:bg-slate-900/70 dark:text-sky-300 dark:shadow-[0_12px_28px_rgba(2,132,199,0.16)]">
              {isRemote ? "Remote Service" : "Local Service"}
            </div>

            {service.icons && service.icons.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
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
                      className="flex h-12 w-12 items-center justify-center rounded-lg border border-sky-200/80 bg-sky-100/85 shadow-[0_8px_18px_rgba(59,130,246,0.12)] dark:border-sky-400/14 dark:bg-slate-800/88 dark:shadow-[0_10px_22px_rgba(2,132,199,0.14)]"
                    >
                      <LucideIcon className="w-6 h-6 text-blue-700 dark:text-sky-300" />
                    </div>
                  ) : null;
                })}
              </div>
            )}

            <div className="space-y-2">
              <h1 className="text-3xl font-bold leading-tight text-slate-950 dark:text-white sm:text-4xl">
                {service.title}
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-300 sm:text-lg">
                {service.headline}
              </p>
            </div>
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
          <section className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/76 p-6 shadow-[0_16px_38px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md dark:border-sky-400/18 dark:bg-slate-950/74 dark:shadow-[0_22px_48px_rgba(2,6,23,0.36)] dark:ring-white/5 sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.06),transparent_54%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_52%)]" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
              What to Expect
            </h2>

            <div className="relative grid gap-6 sm:grid-cols-3 sm:gap-8">
              <div className="flex flex-col items-center space-y-3 rounded-xl border border-slate-200/80 bg-white/70 px-4 py-5 text-center shadow-[0_10px_24px_rgba(15,23,42,0.08)] ring-1 ring-white/65 backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-900/60 dark:shadow-[0_16px_32px_rgba(2,6,23,0.28)] dark:ring-white/5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-sky-300/70 bg-sky-100/85 text-2xl font-bold text-sky-700 shadow-[0_8px_18px_rgba(59,130,246,0.12)] dark:border-sky-400/18 dark:bg-slate-800/90 dark:text-sky-300 dark:shadow-[0_10px_24px_rgba(2,132,199,0.16)]">
                  1
                </div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  Contact Us
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Call, text, or book online—we&apos;ll respond quickly
                </p>
              </div>

              <div className="flex flex-col items-center space-y-3 rounded-xl border border-slate-200/80 bg-white/70 px-4 py-5 text-center shadow-[0_10px_24px_rgba(15,23,42,0.08)] ring-1 ring-white/65 backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-900/60 dark:shadow-[0_16px_32px_rgba(2,6,23,0.28)] dark:ring-white/5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-sky-300/70 bg-sky-100/85 text-2xl font-bold text-sky-700 shadow-[0_8px_18px_rgba(59,130,246,0.12)] dark:border-sky-400/18 dark:bg-slate-800/90 dark:text-sky-300 dark:shadow-[0_10px_24px_rgba(2,132,199,0.16)]">
                  2
                </div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  We Assess
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Clear diagnosis with upfront pricing, no surprises
                </p>
              </div>

              <div className="flex flex-col items-center space-y-3 rounded-xl border border-slate-200/80 bg-white/70 px-4 py-5 text-center shadow-[0_10px_24px_rgba(15,23,42,0.08)] ring-1 ring-white/65 backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-900/60 dark:shadow-[0_16px_32px_rgba(2,6,23,0.28)] dark:ring-white/5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-sky-300/70 bg-sky-100/85 text-2xl font-bold text-sky-700 shadow-[0_8px_18px_rgba(59,130,246,0.12)] dark:border-sky-400/18 dark:bg-slate-800/90 dark:text-sky-300 dark:shadow-[0_10px_24px_rgba(2,132,199,0.16)]">
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
