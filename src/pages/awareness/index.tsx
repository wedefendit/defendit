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
  PageContainer,
  Meta,
  SafetyTipsList,
  ElderlyScamsList,
} from "@/components";
import { generateFAQPageLd, localBusinessLd } from "@/lib/json-ld";
export default function AwarenessPage() {
  const canonical = "https://www.wedefendit.com/awareness";

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.wedefendit.com/",
      },
      { "@type": "ListItem", position: 2, name: "Awareness", item: canonical },
    ],
  };

  const awarenessPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Cybersecurity Awareness for Seniors | Defend I.T. Solutions",
    url: canonical,
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: "https://www.wedefendit.com/og-image.png",
    },
    about: localBusinessLd, // from your json-ld.ts shared definition
  };

  const faqLd = generateFAQPageLd([
    {
      name: "Who is this guide for?",
      acceptedAnswer:
        "Retirees, seniors, caregivers, and community groups in Central Florida. It is written in plain English with practical steps.",
    },
    {
      name: "Do you collect data on this page?",
      acceptedAnswer:
        "No. There is no tracking on this page. It is education only.",
    },
  ]);

  return (
    <>
      <Meta
        title="Cybersecurity Awareness for Seniors | Defend I.T. Solutions"
        description="Practical safety tips and scam prevention guidance for retirees and seniors in Ocala, The Villages, and nearby communities."
        url={canonical}
        image="https://www.wedefendit.com/og-image.png"
        canonical={canonical}
        keywords="cybersecurity for seniors, scam prevention, phishing, Ocala, The Villages, free training"
        structuredData={{
          "@graph": [breadcrumbLd, awarenessPageLd, faqLd],
        }}
      />

      <PageContainer>
        <div className="max-w-5xl mx-auto py-8 sm:py-10 space-y-6 sm:space-y-7 px-4 sm:px-6 text-center sm:text-left bg-gray-50/10 dark:bg-slate-950/20 z-0 rounded-lg shadow-lg">
          {/* Breadcrumbs (match ServiceSlug) */}
          <nav
            aria-label="Breadcrumb"
            className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 overflow-x-auto whitespace-nowrap"
          >
            <ol className="flex items-center gap-1 sm:gap-2">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="px-1 sm:px-2">
                ›
              </li>
              <li className="text-gray-400 dark:text-gray-500 truncate">
                <span aria-current="page">Awareness</span>
              </li>
            </ol>
          </nav>

          {/* Hero */}
          <header className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/78 px-6 py-8 text-center shadow-[0_18px_40px_rgba(15,23,42,0.08)] ring-1 ring-white/75 backdrop-blur-md dark:border-sky-400/18 dark:bg-slate-950/78 dark:shadow-[0_24px_60px_rgba(2,6,23,0.42)] dark:ring-white/5">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_54%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_52%)]" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-24 w-52 -translate-x-1/2 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-400/16" />
            <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/60 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-700 shadow-[0_8px_20px_rgba(56,189,248,0.12)] backdrop-blur-sm dark:border-sky-400/18 dark:bg-slate-900/70 dark:text-sky-300 dark:shadow-[0_12px_28px_rgba(2,132,199,0.16)]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Free Educational Resource
            </div>
            
            <h1 className="mt-5 text-3xl font-bold leading-tight text-slate-950 dark:text-white sm:text-5xl">
              Cybersecurity Awareness for Seniors
            </h1>
            
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
              Practical, easy-to-understand online safety guidance for older
              adults, families, and community groups in Ocala, Belleview, The
              Villages, and surrounding Central Florida communities.
            </p>
            
            <p className="mx-auto max-w-xl text-sm text-slate-600 dark:text-slate-400">
              No tracking. No scare tactics. No confusing tech jargon. Just
              useful information from a local cybersecurity and tech support
              company.
            </p>
            </div>
          </header>

          {/* Best Practices */}
          <section
            className="pt-6 sm:pt-8 first:pt-0 border-t border-gray-200/60 dark:border-gray-700/60 first:border-t-0 text-center"
            aria-labelledby="best-practices"
          >
            <SafetyTipsList />
          </section>

          {/* Scam Education */}
          <section
            className="pt-6 sm:pt-8 first:pt-0 border-t border-gray-200/60 dark:border-gray-700/60 first:border-t-0 text-center"
            aria-labelledby="top-scams"
          >
            <ElderlyScamsList />
          </section>

          {/* CTA */}
          <section className="pt-6 sm:pt-8 border-t border-gray-200/60 dark:border-gray-700/60">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/76 p-8 text-center shadow-[0_16px_38px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md dark:border-sky-400/18 dark:bg-slate-950/74 dark:shadow-[0_22px_48px_rgba(2,6,23,0.36)] dark:ring-white/5">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.06),transparent_54%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_52%)]" />
              <div className="relative">
              <h2 id="cta" className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Want a Free Group Training?
              </h2>
              <p className="text-md text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Defend I.T. Solutions offers free cybersecurity awareness
                sessions for senior centers, churches, clubs, and community
                groups across Central Florida.
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                These sessions are designed to be simple, practical, and easy
                to follow, with clear explanations and time for questions.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 dark:border dark:border-sky-400/18 dark:bg-sky-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.14),transparent_62%)] dark:shadow-[0_14px_28px_rgba(2,132,199,0.18)] dark:ring-1 dark:ring-white/5 dark:backdrop-blur-sm dark:hover:-translate-y-0.5 dark:hover:border-sky-400/28 dark:hover:bg-sky-900/72 dark:hover:shadow-[0_18px_34px_rgba(2,132,199,0.24)] text-white font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Request a Free Training
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Free for groups of 25 or more. Individual sessions are also
                available for a small fee.
              </p>
              </div>
            </div>
          </section>
        </div>
      </PageContainer>
    </>
  );
}
