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
        "Stop scams, improve account safety, and reduce everyday online risk for your home or family with practical local help.",
      link: "/services/scam-protection",
    },
    {
      icon: <Wrench className="w-8 h-8 text-blue-600 dark:text-sky-400" />,
      title: "Fix",
      description:
        "Repair slow computers, troubleshoot software issues, recover lost data, and upgrade aging hardware.",
      link: "/services/computer-repair",
    },
    {
      icon: <House className="w-8 h-8 text-blue-600 dark:text-sky-400" />,
      title: "Support",
      description:
        "Get in-home help with Wi-Fi, printers, new devices, and everyday tech problems when you want one visit to sort it out.",
      link: "/services/onsite-tech-support",
    },
  ];

  const displayPhone = contact.phone.replace("+1", "");

  return (
    <>
      <Meta
        title="Computer Repair, Virus Removal & Local Tech Help in Central Florida | Defend I.T. Solutions"
        description="Computer repair, virus removal, scam protection, Wi-Fi help, on-site tech support, and account safety for homeowners, retirees, and small businesses in Ocala, The Villages, and Belleview."
        image="https://www.wedefendit.com/og-image.png"
        url="https://www.wedefendit.com/"
        canonical="https://www.wedefendit.com/"
        keywords="computer repair Ocala FL, virus removal The Villages FL, scam protection Belleview FL, Wi-Fi help Central Florida, on-site tech support Ocala, password manager setup Central Florida, local tech help"
        structuredData={localBusinessLd}
      />

      <PageContainer>
        {/* Hero Section */}
        <header className="mx-auto max-w-5xl px-4 py-5 text-center sm:px-6 sm:py-8 md:py-10">
          <h1 className="mx-auto mb-4 max-w-4xl text-balance text-4xl font-bold leading-[0.95] text-gray-900 dark:text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Local Computer Repair, Virus Removal &amp; Network Security
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-base text-gray-600 dark:text-gray-300 sm:text-lg md:text-xl">
            Serving Ocala, The Villages, Belleview, and nearby Central Florida
            communities with practical help for slow computers, scam
            protection, Wi-Fi issues, and on-site tech problems.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
            <Link
              href="/contact#schedule-service"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl dark:border dark:border-sky-400/18 dark:bg-sky-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.14),transparent_62%)] dark:shadow-[0_14px_28px_rgba(2,132,199,0.18)] dark:ring-1 dark:ring-white/5 dark:backdrop-blur-sm dark:hover:-translate-y-0.5 dark:hover:border-sky-400/28 dark:hover:bg-sky-900/72 dark:hover:shadow-[0_18px_34px_rgba(2,132,199,0.24)] sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
            >
              <Phone className="w-5 h-5" />
              Schedule Local Service
            </Link>
            <Link
              href="/services"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-300 px-6 py-3.5 text-base font-semibold text-gray-700 transition-all hover:border-blue-500 dark:border-gray-600 dark:text-gray-300 dark:hover:border-sky-500 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
            >
              View Local Services
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
            We help with computer repair, malware cleanup, scam protection, home
            Wi-Fi issues, and on-site tech support without the jargon.
          </p>

          <div className="grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3 mx-auto">
            {benefits.map((benefit) => (
              <BenefitCard key={benefit.title} {...benefit} />
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="max-w-4xl mx-auto rounded-2xl border border-slate-200/80 bg-white/72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_58%)] px-4 py-12 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md dark:border-slate-700/70 dark:bg-slate-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.09),transparent_60%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Why Choose Defend I.T. Solutions?
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 dark:text-sky-400 font-bold text-xl flex-shrink-0">
                •
              </span>
              <p>
                <strong>No Jargon:</strong> We explain everything in plain
                English so you actually understand what&apos;s happening.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 dark:text-sky-400 font-bold text-xl flex-shrink-0">
                •
              </span>
              <p>
                <strong>No Upsells:</strong> We only recommend what you actually
                need. No scare tactics, no hidden fees.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 dark:text-sky-400 font-bold text-xl flex-shrink-0">
                •
              </span>
              <p>
                <strong>Local & Trusted:</strong> We&apos;re based in Central
                Florida and available for in-person service across Ocala, The
                Villages, and Belleview.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center py-12 px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Call us today or schedule a convenient time to talk.
          </p>
          <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
            <a
              href={`tel:${contact.phone.replace(/[^0-9]/g, "")}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl dark:border dark:border-sky-400/18 dark:bg-sky-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.14),transparent_62%)] dark:shadow-[0_14px_28px_rgba(2,132,199,0.18)] dark:ring-1 dark:ring-white/5 dark:backdrop-blur-sm dark:hover:-translate-y-0.5 dark:hover:border-sky-400/28 dark:hover:bg-sky-900/72 dark:hover:shadow-[0_18px_34px_rgba(2,132,199,0.24)] sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
            >
              <Phone className="w-5 h-5" />
              {displayPhone}
            </a>
            <Link
              href="/contact#schedule-service"
              className="text-center text-base font-medium text-blue-600 hover:underline dark:text-sky-400 sm:text-lg"
            >
              Contact us to schedule local service →
            </Link>
          </div>
        </section>
      </PageContainer>
    </>
  );
}
