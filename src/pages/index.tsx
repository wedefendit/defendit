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
import { ShieldCheck, Wrench, House, Phone, ArrowRight } from "lucide-react";
import Link from "next/link";
import { localBusinessLd } from "@/lib/json-ld";
import companyInfo from "../../data/company-info.json";
import { Meta, PageContainer } from "@/components";
import { InteractiveTraining } from "@/components/InteractiveTraining";

const { contact } = companyInfo;

type BenefitCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
};

function BenefitCard({ icon, title, description, link }: BenefitCardProps) {
  return (
    <Link
      href={link}
      className="group relative flex flex-col items-center overflow-hidden rounded-xl border border-slate-200/80 bg-white/72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_58%)] p-6 text-center shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-white/84 hover:shadow-[0_18px_38px_rgba(15,23,42,0.12)] dark:border-slate-700/70 dark:bg-slate-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.09),transparent_60%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5 dark:hover:border-sky-400/30 dark:hover:bg-slate-900/74 dark:hover:shadow-[0_24px_46px_rgba(2,6,23,0.36)]"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-sky-200/80 bg-sky-100/85 shadow-[0_8px_18px_rgba(59,130,246,0.12)] transition-transform duration-300 group-hover:scale-110 dark:border-sky-400/14 dark:bg-slate-800/88 dark:shadow-[0_10px_22px_rgba(2,132,199,0.14)]">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-700 group-hover:underline dark:text-sky-300">
        Learn more <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  );
}

function TrustBar() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400 py-6 border-y border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <span className="text-green-600 dark:text-green-400">✓</span>
        <span>Florida LLC & Insured</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-green-600 dark:text-green-400">✓</span>
        <span>Local to Central Florida</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-green-600 dark:text-green-400">✓</span>
        <span>Clear Quotes Before Work Begins</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-green-600 dark:text-green-400">✓</span>
        <span>No Pressure Sales</span>
      </div>
    </div>
  );
}

export default function Home() {
  const benefits = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-sky-400" />,
      title: "Protect",
      description:
        "Get practical help with scam prevention, account safety, and safer home technology choices without the fear tactics.",
      link: "/services/scam-protection",
    },
    {
      icon: <Wrench className="w-8 h-8 text-blue-600 dark:text-sky-400" />,
      title: "Fix",
      description:
        "Clean up malware, repair slow or unstable computers, fix software problems, and recover from the kind of tech issues that disrupt everyday life.",
      link: "/services/computer-repair",
    },
    {
      icon: <House className="w-8 h-8 text-blue-600 dark:text-sky-400" />,
      title: "Support",
      description:
        "Get in-home help with Wi-Fi, printers, new devices, and day-to-day tech problems when you want one visit to sort things out.",
      link: "/services/onsite-tech-support",
    },
  ];

  const displayPhone = contact.phone.replace("+1", "");

  return (
    <>
      <Meta
        title="Computer Repair, Virus Removal & Local Tech Support in Central Florida | Defend I.T. Solutions"
        description="Computer repair, virus removal, scam protection, Wi-Fi help, on-site tech support, and account safety for homeowners, retirees, and small businesses in Ocala, The Villages, and Belleview."
        image="https://www.wedefendit.com/og-image.png"
        url="https://www.wedefendit.com/"
        canonical="https://www.wedefendit.com/"
        keywords="computer repair Ocala FL, virus removal The Villages FL, scam protection Belleview FL, Wi-Fi help Central Florida, on-site tech support Ocala, password manager setup Central Florida, local tech support"
        structuredData={localBusinessLd}
      />

      <PageContainer>
        {/* Hero Section */}
        <header className="mx-auto max-w-5xl px-4 py-5 text-center sm:px-6 sm:py-8 md:py-10">
          <h1 className="mx-auto mb-4 max-w-4xl text-balance text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Cybersecurity and Tech Support for Homes and Small Businesses
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg md:text-xl">
            Proudly serving Ocala, Belleview, and The Villages
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl dark:border dark:border-sky-400/18 dark:bg-sky-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.14),transparent_62%)] dark:shadow-[0_14px_28px_rgba(2,132,199,0.18)] dark:ring-1 dark:ring-white/5 dark:backdrop-blur-sm dark:hover:-translate-y-0.5 dark:hover:border-sky-400/28 dark:hover:bg-sky-900/72 dark:hover:shadow-[0_18px_34px_rgba(2,132,199,0.24)] sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
            >
              <Phone className="w-5 h-5" />
              Request Local Help
            </Link>
            <Link
              href="/services"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-300 px-6 py-3.5 text-base font-semibold text-gray-700 transition-all hover:border-blue-500 dark:border-gray-600 dark:text-gray-300 dark:hover:border-sky-500 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
            >
              View Services
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </header>

        <TrustBar />

        {/* What We Do Section */}
        <section className="py-12 px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
            What We Do
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            We help with everyday tech problems and the security issues that
            come with them. That means malware cleanup, scam help, Wi-Fi
            trouble, device setup, and safer systems for homes and small
            businesses without the jargon or pressure.
          </p>

          <div className="grid max-w-2xl gap-6 mx-auto lg:max-w-5xl lg:grid-cols-3">
            {benefits.map((benefit) => (
              <BenefitCard key={benefit.title} {...benefit} />
            ))}
          </div>
        </section>

        <section className="py-12 px-6 max-w-6xl">
          <InteractiveTraining />
        </section>

        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.03),transparent_60%)] px-6 py-7 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md dark:border-slate-700/70 dark:bg-slate-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.06),transparent_62%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5 sm:px-8 sm:py-8 lg:px-11 lg:pt-10 lg:pb-9">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                Why Choose Defend I.T. Solutions?
              </h2>

              <p className="mt-6 max-w-[66ch] text-base leading-7 text-gray-700 dark:text-gray-400 sm:text-lg sm:leading-8">
                Defend I.T. Solutions brings a security-minded approach to the
                kind of tech problems people actually run into. The work is
                local, straightforward, and built around clear recommendations
                instead of upsells or scare tactics.
              </p>

              <div className="mt-8 grid gap-x-10 gap-y-5 text-gray-700 dark:text-gray-300 md:grid-cols-2">
                <div className="space-y-5">
                  {[
                    "Local to Central Florida",
                    "Security-first recommendations",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="text-blue-600 dark:text-sky-400 font-bold text-xl flex-shrink-0">
                        •
                      </span>
                      <p className="text-base font-medium sm:text-lg">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-5">
                  {["Clear quotes before work begins", "No pressure sales"].map(
                    (item) => (
                      <div key={item} className="flex items-start gap-3">
                        <span className="text-blue-600 dark:text-sky-400 font-bold text-xl flex-shrink-0">
                          •
                        </span>
                        <p className="text-base font-medium sm:text-lg">
                          {item}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-6 border-t border-slate-200/60 pt-6 dark:border-slate-700/60 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-1 text-blue-600 transition hover:underline dark:text-sky-400"
                  >
                    About Defend I.T. Solutions
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-1 text-blue-600 transition hover:underline dark:text-sky-400"
                  >
                    View Services
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="flex flex-col items-start gap-2 md:items-end">
                  <a
                    href={`tel:${contact.phone.replaceAll(/[^\D]/g, "")}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl dark:border dark:border-sky-400/18 dark:bg-sky-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.14),transparent_62%)] dark:shadow-[0_14px_28px_rgba(2,132,199,0.18)] dark:ring-1 dark:ring-white/5 dark:backdrop-blur-sm dark:hover:-translate-y-0.5 dark:hover:border-sky-400/28 dark:hover:bg-sky-900/72 dark:hover:shadow-[0_18px_34px_rgba(2,132,199,0.24)] md:w-auto"
                  >
                    <Phone className="w-5 h-5 flex-shrink-0" />
                    {displayPhone}
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition hover:underline dark:text-sky-400"
                  >
                    More Contact Options
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </PageContainer>
    </>
  );
}
