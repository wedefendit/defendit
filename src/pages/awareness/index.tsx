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
        <div className="max-w-5xl mx-auto w-full py-8 sm:py-10 space-y-6 sm:space-y-7 px-3 sm:px-6 text-center sm:text-left bg-gray-50/10 dark:bg-slate-950/20 z-0 rounded-lg shadow-lg">
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
          <header className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/78 px-5 py-6 text-center shadow-[0_18px_40px_rgba(15,23,42,0.08)] ring-1 ring-white/75 backdrop-blur-md dark:border-sky-400/18 dark:bg-slate-950/78 dark:shadow-[0_24px_60px_rgba(2,6,23,0.42)] dark:ring-white/5 sm:px-6 sm:py-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_54%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_52%)]" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-24 w-52 -translate-x-1/2 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-400/16" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/60 bg-white/70 px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-sky-700 shadow-[0_8px_20px_rgba(56,189,248,0.12)] backdrop-blur-sm dark:border-sky-400/18 dark:bg-slate-900/70 dark:text-sky-300 dark:shadow-[0_12px_28px_rgba(2,132,199,0.16)] sm:px-4 sm:text-xs sm:tracking-[0.28em]">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Free Educational Resource
              </div>

              <h1 className="mt-5 text-balance text-3xl font-bold leading-tight text-slate-950 dark:text-white sm:text-4xl md:text-5xl">
                Online Safety Tips for Seniors, Families, and Community Groups
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
                Plain-English guidance on scams, safer browsing, stronger
                accounts, and everyday habits that reduce risk.
              </p>
            </div>
          </header>

          {/* Interactive training */}
          <section
            className="pt-6 sm:pt-8 first:pt-0 border-t border-gray-200/60 dark:border-gray-700/60 first:border-t-0"
            aria-labelledby="interactive-training"
          >
            <div className="mb-5 text-center">
              <h2
                id="interactive-training"
                className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white"
              >
                Interactive Training
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
                Hands-on exercises that teach one core security idea at a time.
                Play at your own pace — no sign-in.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/awareness/digital-house"
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/78 p-5 text-left shadow-[0_16px_38px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(15,23,42,0.14)] dark:border-sky-400/18 dark:bg-slate-950/74 dark:shadow-[0_22px_48px_rgba(2,6,23,0.36)] dark:ring-white/5 dark:hover:border-sky-400/35"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.07),transparent_60%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_60%)]" />
                <div className="relative">
                  {/* Inline SVG thumbnail — 2-story house silhouette mirroring the game art */}
                  <div className="mb-4 flex items-end justify-center rounded-xl border border-slate-200/60 bg-slate-100/60 p-4 dark:border-sky-900/40 dark:bg-slate-900/50">
                    <svg
                      viewBox="0 0 140 110"
                      width="140"
                      height="110"
                      aria-hidden
                      className="drop-shadow-md"
                    >
                      {/* Roof */}
                      <polygon points="70,12 16,50 124,50" fill="#4a5568" />
                      {/* Chimney */}
                      <rect x="94" y="22" width="10" height="18" fill="#5d4a38" />
                      <rect x="92" y="20" width="14" height="4" fill="#4a3c30" />
                      {/* Walls backdrop */}
                      <rect x="18" y="50" width="104" height="50" fill="#6b5744" />
                      {/* 2F rooms */}
                      <rect x="22" y="54" width="48" height="20" fill="#d4c4a0" />
                      <rect x="72" y="54" width="48" height="20" fill="#ccc4b4" />
                      {/* Floor beam */}
                      <rect x="20" y="75" width="102" height="3" fill="#4a3c30" />
                      {/* 1F rooms */}
                      <rect x="22" y="79" width="48" height="19" fill="#d4c4a0" />
                      <rect x="72" y="79" width="48" height="19" fill="#ddd8d0" />
                      {/* Foundation */}
                      <rect x="18" y="100" width="104" height="5" fill="#2e261f" />
                      {/* Front door on 1F right room */}
                      <rect x="90" y="84" width="12" height="14" fill="#5d4a38" />
                      <circle cx="100" cy="92" r="1" fill="#d4a84b" />
                      {/* Window dots to signal "rooms" */}
                      <rect x="34" y="60" width="8" height="6" fill="#38bdf8" opacity="0.4" />
                      <rect x="50" y="60" width="8" height="6" fill="#38bdf8" opacity="0.4" />
                      <rect x="84" y="60" width="8" height="6" fill="#a78bfa" opacity="0.4" />
                      <rect x="100" y="60" width="8" height="6" fill="#a78bfa" opacity="0.4" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block rounded-full border border-sky-300/60 bg-sky-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:border-sky-500/40 dark:bg-sky-950/50 dark:text-sky-300">
                      New
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Game · 5 min
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                    The Digital House
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                    Place devices into rooms and see how trust, exposure, and
                    recovery shift as you design your home network.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 dark:text-sky-400">
                    Play
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </section>

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
                <h2
                  id="cta"
                  className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white"
                >
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
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
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
