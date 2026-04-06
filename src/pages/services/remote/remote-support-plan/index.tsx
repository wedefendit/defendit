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
  PageContainer,
  Meta,
  BreadCrumbs,
  JsonLdScript,
  FaqSection,
} from "@/components";
import { generateFAQPageLd, localBusinessLd } from "@/lib/json-ld";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RemoteSupportPlanPage() {
  const faq = [
    {
      question: "Do you require a VPN?",
      answer:
        "No. DISecureLink routes only support traffic with split tunneling. Regular browsing stays on your normal connection.",
    },
    {
      question: "Can you access my devices at any time?",
      answer:
        "Access is consent-based. You choose unattended or on-demand. Permissions are scoped per device.",
    },
    {
      question: "Is my data visible to third parties?",
      answer:
        "Sessions are encrypted. We do not sell or share client data. Access is limited to verified technicians.",
    },
    {
      question: "Can non-local clients enroll?",
      answer: "No. Enrollment requires on-site verification in our service area.",
    },
  ];

  const faqLd = generateFAQPageLd(
    faq.map(({ question, answer }) => ({
      name: question,
      acceptedAnswer: answer,
    })),
  );

  return (
    <>
      <Meta
        title="Remote Support Service Plan | Defend I.T. Solutions"
        description="Details about our secure, client-only Remote Support Plan. Learn how DIS Connect™, DISNet™, and DISecureLink™ provide professional remote tech support."
        url="https://www.wedefendit.com/remote-support-plan"
        image="https://www.wedefendit.com/og-image.png"
        keywords="Remote support, secure remote access, local IT support, DISConnect, DISNet, DISecureLink, Defend I.T. Solutions"
      />

      <JsonLdScript jsonLd={localBusinessLd} />
      <JsonLdScript jsonLd={faqLd} />
      <PageContainer>
        {/* Left by default on mobile; larger screens inherit existing look */}
        <main className="max-w-4xl mx-auto py-8 sm:py-10 space-y-6 sm:space-y-7 px-4 sm:px-6 text-left bg-gray-50/10 dark:bg-slate-950/20 rounded-lg shadow-lg">
          <BreadCrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Services", href: "/services" },
              { name: "Remote", href: "/services/remote" },
              {
                name: "Remote Support Plan",
                href: "/services/remote/remote-support-plan",
              },
            ]}
            includeJsonLd={true}
          />

          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/78 px-6 py-8 shadow-[0_18px_40px_rgba(15,23,42,0.08)] ring-1 ring-white/75 backdrop-blur-md dark:border-sky-400/18 dark:bg-slate-950/78 dark:shadow-[0_24px_60px_rgba(2,6,23,0.42)] dark:ring-white/5 space-y-4">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_54%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_52%)]" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-24 w-52 -translate-x-1/2 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-400/16" />
            <div className="relative inline-flex items-center gap-2 rounded-full border border-sky-300/60 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-700 shadow-[0_8px_20px_rgba(56,189,248,0.12)] backdrop-blur-sm dark:border-sky-400/18 dark:bg-slate-900/70 dark:text-sky-300 dark:shadow-[0_12px_28px_rgba(2,132,199,0.16)]">
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
              Local Clients Only
            </div>

            <h1 className="relative text-3xl font-bold leading-tight text-slate-950 dark:text-white sm:text-5xl">
              Remote Support Service Plan
            </h1>

            <p className="relative max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
              Secure and private remote support for verified local clients.
            </p>

            {/* Feature Highlights - Now Visual Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="relative flex items-center gap-3 overflow-hidden rounded-xl border border-slate-200/80 bg-white/72 p-3 shadow-[0_10px_24px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-900/62 dark:shadow-[0_16px_30px_rgba(2,6,23,0.28)] dark:ring-white/5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-sky-200/80 bg-sky-100/85 shadow-[0_8px_18px_rgba(59,130,246,0.12)] dark:border-sky-400/14 dark:bg-slate-800/88 dark:shadow-[0_10px_22px_rgba(2,132,199,0.14)]">
                  <svg
                    className="w-5 h-5 text-blue-700 dark:text-sky-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Encrypted Sessions
                </span>
              </div>

              <div className="relative flex items-center gap-3 overflow-hidden rounded-xl border border-slate-200/80 bg-white/72 p-3 shadow-[0_10px_24px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-900/62 dark:shadow-[0_16px_30px_rgba(2,6,23,0.28)] dark:ring-white/5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-sky-200/80 bg-sky-100/85 shadow-[0_8px_18px_rgba(59,130,246,0.12)] dark:border-sky-400/14 dark:bg-slate-800/88 dark:shadow-[0_10px_22px_rgba(2,132,199,0.14)]">
                  <svg
                    className="w-5 h-5 text-blue-700 dark:text-sky-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Consent-Based Access
                </span>
              </div>

              <div className="relative flex items-center gap-3 overflow-hidden rounded-xl border border-slate-200/80 bg-white/72 p-3 shadow-[0_10px_24px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-900/62 dark:shadow-[0_16px_30px_rgba(2,6,23,0.28)] dark:ring-white/5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-sky-200/80 bg-sky-100/85 shadow-[0_8px_18px_rgba(59,130,246,0.12)] dark:border-sky-400/14 dark:bg-slate-800/88 dark:shadow-[0_10px_22px_rgba(2,132,199,0.14)]">
                  <svg
                    className="w-5 h-5 text-blue-700 dark:text-sky-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Local Enrollment
                </span>
              </div>
            </div>
          </div>

          {/* Why a plan */}
          <section
            className="pt-6 sm:pt-8 first:pt-0 border-t border-gray-200/60 dark:border-gray-700/60 first:border-t-0"
            aria-labelledby="why-plan"
          >
            <h2 id="why-plan" className="text-2xl font-semibold">
              Why a Support Plan
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              We operate a private remote access environment (DISNet™) with a
              scoped support tunnel (DISecureLink™) and our own remote service
              infrastructure. Access is restricted to enrolled clients and
              managed devices.
            </p>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              The plan funds the secure operation of this environment:
              provisioning, monitoring, updates, audits, and capacity reserved
              for clients. Ensuring help is fast, private, and reliable when you
              need it.
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              New to our services?{" "}
              <Link
                href="/contact"
                className="text-blue-600 dark:text-sky-400 hover:underline"
              >
                Contact us
              </Link>
              .
            </p>
          </section>

          {/* Technical Approach */}
          <section
            className="pt-6 sm:pt-8 border-t border-gray-200/60 dark:border-gray-700/60"
            aria-labelledby="tech-approach"
          >
            <h2 id="tech-approach" className="text-2xl font-semibold">
              Technical Approach
            </h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white/72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_58%)] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-white/84 hover:shadow-[0_16px_32px_rgba(15,23,42,0.12)] dark:border-slate-700/70 dark:bg-slate-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.09),transparent_60%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5 dark:hover:border-sky-400/30 dark:hover:bg-slate-900/74 dark:hover:shadow-[0_24px_46px_rgba(2,6,23,0.36)]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-sky-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Private Infrastructure
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Remote access services live on our private network and are
                      not exposed to the public internet.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white/72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_58%)] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-white/84 hover:shadow-[0_16px_32px_rgba(15,23,42,0.12)] dark:border-slate-700/70 dark:bg-slate-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.09),transparent_60%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5 dark:hover:border-sky-400/30 dark:hover:bg-slate-900/74 dark:hover:shadow-[0_24px_46px_rgba(2,6,23,0.36)]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-sky-400"
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
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Scoped Access
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      The support tunnel is limited to approved service routes;
                      normal browsing stays on your regular connection.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white/72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_58%)] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-white/84 hover:shadow-[0_16px_32px_rgba(15,23,42,0.12)] dark:border-slate-700/70 dark:bg-slate-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.09),transparent_60%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5 dark:hover:border-sky-400/30 dark:hover:bg-slate-900/74 dark:hover:shadow-[0_24px_46px_rgba(2,6,23,0.36)]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-sky-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Layered Protection
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Session encryption runs inside the private tunnel for
                      defense in depth.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white/72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_58%)] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-white/84 hover:shadow-[0_16px_32px_rgba(15,23,42,0.12)] dark:border-slate-700/70 dark:bg-slate-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.09),transparent_60%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5 dark:hover:border-sky-400/30 dark:hover:bg-slate-900/74 dark:hover:shadow-[0_24px_46px_rgba(2,6,23,0.36)]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-sky-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Least-Privilege Control
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Access is consent-based and limited to enrolled devices;
                      enrollment and revocation are handled per device.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white/72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_58%)] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-white/84 hover:shadow-[0_16px_32px_rgba(15,23,42,0.12)] dark:border-slate-700/70 dark:bg-slate-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.09),transparent_60%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5 dark:hover:border-sky-400/30 dark:hover:bg-slate-900/74 dark:hover:shadow-[0_24px_46px_rgba(2,6,23,0.36)]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-sky-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Network Isolation
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Segmented zones with default-deny rules; only explicit
                      service paths are allowed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white/72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_58%)] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-white/84 hover:shadow-[0_16px_32px_rgba(15,23,42,0.12)] dark:border-slate-700/70 dark:bg-slate-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.09),transparent_60%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5 dark:hover:border-sky-400/30 dark:hover:bg-slate-900/74 dark:hover:shadow-[0_24px_46px_rgba(2,6,23,0.36)]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-sky-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Operational Hardening
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Ongoing monitoring, maintenance, and updates performed by
                      our team.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Included */}
          <section
            className="pt-6 sm:pt-8 border-t border-gray-200/60 dark:border-gray-700/60"
            aria-labelledby="included"
          >
            <h2 id="included" className="text-2xl font-semibold">
              What Is Included
            </h2>
            <ul className="mt-2 list-disc pl-5 sm:pl-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base space-y-2 marker:text-sky-500 dark:marker:text-sky-400">
              <li>Priority scheduling for common issues</li>
              <li>Access control options: unattended or on-demand</li>
              <li>
                Encrypted remote sessions with screen sharing and clipboard
                support
              </li>
              <li>
                DIS Connect™ for launching and managing sessions (not required)
              </li>
              <li>
                Access for up to 14* enrolled devices{" "}
                <Link
                  href="#more-devices"
                  className="text-blue-600 dark:text-sky-400 hover:underline"
                >
                  (see options)
                </Link>{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  (subscription members)
                </span>
              </li>
              <li>
                Reduced labor rates for most remote services{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  (subscription members)
                </span>
              </li>
              <li>
                After-hours support for urgent problems{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  (subscription members)
                </span>
              </li>
            </ul>
          </section>

          {/* Eligibility */}
          <section
            className="pt-6 sm:pt-8 border-t border-gray-200/60 dark:border-gray-700/60"
            aria-labelledby="eligibility"
          >
            <h2 id="eligibility" className="text-2xl font-semibold">
              Who Is Eligible
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Clients in Ocala, Belleview, The Villages, and nearby areas.
            </p>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Each device must be enrolled locally. No open enrollment or remote
              setup for non-local clients.
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              See our{" "}
              <Link
                href="/awareness"
                className="text-blue-600 dark:text-sky-400 hover:underline"
              >
                security awareness
              </Link>{" "}
              resources.
            </p>
          </section>

          {/* Tiered Support */}
          <section
            className="pt-6 sm:pt-8 border-t border-gray-200/60 dark:border-gray-700/60"
            aria-labelledby="tiered-support"
          >
            <h2 id="tiered-support" className="text-2xl font-semibold mb-4">
              Tiered Support Options
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300 mb-6">
              Our Remote Support Plan is flexible, with tiers based on how you
              prefer to connect:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Tier 1 */}
              <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white/72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_58%)] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-white/84 hover:shadow-[0_18px_38px_rgba(15,23,42,0.12)] dark:border-slate-700/70 dark:bg-slate-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.09),transparent_60%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5 dark:hover:border-sky-400/30 dark:hover:bg-slate-900/74 dark:hover:shadow-[0_24px_46px_rgba(2,6,23,0.36)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-sky-300/70 bg-sky-100/85 text-xl font-bold text-sky-700 shadow-[0_8px_18px_rgba(59,130,246,0.12)] dark:border-sky-400/18 dark:bg-slate-800/90 dark:text-sky-300 dark:shadow-[0_10px_24px_rgba(2,132,199,0.16)]">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Tier 1
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>Fully Asynchronous Remote Support</strong>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  We can connect without you being present once devices are
                  enrolled and permissions are set. Perfect for updates,
                  maintenance, and non-urgent fixes.
                </p>
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    ✓ Unattended access
                    <br />
                    ✓ After-hours support
                    <br />✓ Automated maintenance
                  </p>
                </div>
              </div>

              {/* Tier 2 */}
              <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white/72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_58%)] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-white/84 hover:shadow-[0_18px_38px_rgba(15,23,42,0.12)] dark:border-slate-700/70 dark:bg-slate-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.09),transparent_60%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5 dark:hover:border-sky-400/30 dark:hover:bg-slate-900/74 dark:hover:shadow-[0_24px_46px_rgba(2,6,23,0.36)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-sky-300/70 bg-sky-100/85 text-xl font-bold text-sky-700 shadow-[0_8px_18px_rgba(59,130,246,0.12)] dark:border-sky-400/18 dark:bg-slate-800/90 dark:text-sky-300 dark:shadow-[0_10px_24px_rgba(2,132,199,0.16)]">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Tier 2
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>Client-Initiated Support</strong>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  You will be present to start sessions and enter any necessary
                  credentials. Great for hands-on support and training sessions.
                </p>
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    ✓ On-demand sessions
                    <br />
                    ✓ Full control
                    <br />✓ Live interaction
                  </p>
                </div>
              </div>
            </div>

            <div className="relative mt-6 overflow-hidden rounded-xl border border-slate-200/80 bg-white/72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_58%)] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md dark:border-slate-700/70 dark:bg-slate-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.09),transparent_60%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.28)] dark:ring-white/5">
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                <strong>Both tiers available as:</strong> Subscription (includes
                member benefits, discounts, and after-hours priority) or
                Pay-As-You-Go (standard rates, one device limit, no member
                discounts).
              </p>
            </div>
          </section>

          {/* View Remote Services */}
          <section
            className="pt-6 sm:pt-8 border-t border-gray-200/60 dark:border-gray-700/60"
            aria-labelledby="view-remote-services"
          >
            <h2
              id="view-remote-services"
              className="text-2xl font-semibold mb-4"
            >
              View Remote Services
            </h2>
            <div className="relative mt-3 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/76 p-6 text-center shadow-[0_16px_38px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md dark:border-sky-400/18 dark:bg-slate-950/74 dark:shadow-[0_22px_48px_rgba(2,6,23,0.36)] dark:ring-white/5">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.06),transparent_54%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_52%)]" />
              <div className="relative">
              <p className="text-gray-900 dark:text-white mb-4">
                Explore all our remote service offerings for local clients,
                including troubleshooting, maintenance, security assessments,
                and more.
              </p>
              <Link
                href="/services/remote"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-700 dark:border dark:border-sky-400/18 dark:bg-sky-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.14),transparent_62%)] dark:shadow-[0_14px_28px_rgba(2,132,199,0.18)] dark:ring-1 dark:ring-white/5 dark:backdrop-blur-sm dark:hover:-translate-y-0.5 dark:hover:border-sky-400/28 dark:hover:bg-sky-900/72 dark:hover:shadow-[0_18px_34px_rgba(2,132,199,0.24)] text-white font-semibold transition-all shadow-md hover:shadow-lg"
              >
                View Remote Services
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section
            className="pt-6 sm:pt-8 border-t border-gray-200/60 dark:border-gray-700/60"
            aria-labelledby="enroll"
          >
            <h2 id="enroll" className="text-2xl font-semibold mb-4">
              Ready to Enroll
            </h2>
            <div className="mt-3 rounded-lg bg-gradient-to-br from-blue-600 to-sky-600 dark:from-sky-700 dark:to-blue-700 text-white p-8 shadow-lg text-center">
              <p className="text-lg mb-2 font-semibold">
                Get Started with Remote Support
              </p>
              <p className="text-sm opacity-95 mb-6 max-w-2xl mx-auto">
                Initial on-site setup and enrollment are included at no
                additional cost* when you join the Remote Support Plan.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-blue-700 dark:text-sky-900 font-semibold hover:bg-gray-100 dark:hover:bg-gray-200 transition-all shadow-lg"
              >
                Request Remote Setup
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
              <p className="mt-4 text-xs opacity-85">
                * Within our local service area (Ocala, Belleview, The
                Villages).
              </p>
            </div>
          </section>

          {/* More devices */}
          <section
            className="pt-6 sm:pt-8 border-t border-gray-200/60 dark:border-gray-700/60"
            aria-labelledby="more-devices"
            id="more-devices"
          >
            <h2 className="text-2xl font-semibold">
              Need Coverage for More Devices?
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Our Remote Support Plan includes up to 14 enrolled devices. This
              is plenty for most homes and small offices. If you have a larger
              setup, we can extend coverage with custom device limits and access
              tiers.
            </p>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Expanded plans are tailored to your needs, with any additional
              setup or service costs discussed up front, no surprises.
            </p>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              <Link
                href="/contact"
                className="text-blue-600 dark:text-sky-400 hover:underline"
              >
                Let&apos;s talk about your requirements
              </Link>{" "}
              and design a plan that fits.
            </p>
          </section>

          {/* FAQ */}
          <FaqSection items={faq} />
        </main>
      </PageContainer>
    </>
  );
}
