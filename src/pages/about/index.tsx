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
import { localBusinessLd } from "@/lib/json-ld";
import type { ComponentType, SVGProps } from "react";
import { ShieldCheck, MapPin, MessageCircle } from "lucide-react";
import { PageContainer, Meta, BookOnline, BreadCrumbs } from "@/components";

const valueData = [
  {
    title: "Security First",
    description:
      "Your privacy, devices, and data come first. We recommend modern, right-sized protections based on your actual needs, not one-size-fits-all solutions.",
    icon: ShieldCheck,
  },
  {
    title: "Local and Personal",
    description:
      "No call centers. No outsourced scripts. Just real local support from someone who understands the needs of Ocala, Belleview, The Villages, and nearby communities.",
    icon: MapPin,
  },
  {
    title: "Clear, Honest Support",
    description:
      "We explain problems in plain English, give straightforward recommendations, and help you make informed decisions without pressure.",
    icon: MessageCircle,
  },
] as const;

type ValueItemProps = {
  title: string;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

function ValueItem({ title, description, Icon }: ValueItemProps) {
  return (
    <article className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white/72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_58%)] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-white/84 hover:shadow-[0_18px_38px_rgba(15,23,42,0.12)] dark:border-slate-700/70 dark:bg-slate-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.09),transparent_60%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5 dark:hover:border-sky-400/30 dark:hover:bg-slate-900/74 dark:hover:shadow-[0_24px_46px_rgba(2,6,23,0.36)]">
      <div className="flex items-center gap-4 mb-3">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-sky-200/80 bg-sky-100/85 shadow-[0_8px_18px_rgba(59,130,246,0.12)] dark:border-sky-400/14 dark:bg-slate-800/88 dark:shadow-[0_10px_22px_rgba(2,132,199,0.14)]">
          <Icon
            className="w-7 h-7 text-blue-700 dark:text-sky-300"
            aria-hidden="true"
          />
        </div>
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {description}
      </p>
    </article>
  );
}

function RenderValues() {
  return (
    <div className="grid gap-6 md:grid-cols-1" role="list">
      {valueData.map((item) => (
        <div key={item.title}>
          <ValueItem
            title={item.title}
            description={item.description}
            Icon={item.icon}
          />
        </div>
      ))}
    </div>
  );
}

export default function About() {
  const canonical = "https://www.wedefendit.com/about";

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
      { "@type": "ListItem", position: 2, name: "About", item: canonical },
    ],
  };

  const aboutPageLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Defend I.T. Solutions",
    url: canonical,
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: "https://www.wedefendit.com/og-image.png",
    },
    about: {
      ...localBusinessLd,
      sameAs: [
        "https://www.google.com/search?q=Defend+I.T.+Solutions+Ocala",
        "https://www.facebook.com/",
      ],
      hasMap:
        "https://www.google.com/maps/search/?api=1&query=Defend+I.T.+Solutions+Ocala+FL",
    },
  };

  return (
    <>
      <Meta
        title="About Defend I.T. Solutions | Cybersecurity & IT Support in Ocala, Belleview & The Villages"
        description="Learn about Defend I.T. Solutions, a local cybersecurity and IT support company serving Ocala, Belleview, The Villages, and surrounding Central Florida communities with privacy-first, on-site tech support."
        image="https://www.wedefendit.com/og-image.png"
        url={canonical}
        canonical={canonical}
        keywords="Defend I.T. Solutions, cybersecurity Ocala FL, IT support Belleview FL, IT support The Villages FL, local tech support Central Florida, privacy-focused IT services"
        structuredData={{ "@graph": [breadcrumbLd, aboutPageLd] }}
      />

      <PageContainer>
        <div className="max-w-3xl mx-auto p-4 space-y-10 rounded bg-gray-50/10 dark:bg-slate-950/20 shadow-sm">
          <BreadCrumbs
            includeJsonLd={false}
            items={[{ name: "Home", href: "/" }, { name: "About" }]}
          />

          {/* Hero Section */}
          <header className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/78 px-6 py-8 text-center shadow-[0_18px_40px_rgba(15,23,42,0.08)] ring-1 ring-white/75 backdrop-blur-md dark:border-sky-400/18 dark:bg-slate-950/78 dark:shadow-[0_24px_60px_rgba(2,6,23,0.42)] dark:ring-white/5">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_54%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_52%)]" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-24 w-52 -translate-x-1/2 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-400/16" />
            <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/60 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-700 shadow-[0_8px_20px_rgba(56,189,248,0.12)] backdrop-blur-sm dark:border-sky-400/18 dark:bg-slate-900/70 dark:text-sky-300 dark:shadow-[0_12px_28px_rgba(2,132,199,0.16)]">
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Locally Owned & Operated
            </div>

            <h1 className="mt-5 text-4xl font-bold text-slate-950 dark:text-white md:text-5xl">
              About Defend I.T. Solutions
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Local cybersecurity and IT support serving Ocala, Belleview, The
              Villages, and surrounding Central Florida.
            </p>
            </div>
          </header>

          <section
            aria-labelledby="who-we-are"
            className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_58%)] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md dark:border-slate-700/70 dark:bg-slate-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.09),transparent_60%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5"
          >
            <p className="text-lg text-gray-900 dark:text-white">
              <strong className="text-blue-600 dark:text-sky-400">
                Defend I.T. Solutions
              </strong>{" "}
              is a locally owned cybersecurity and tech support company based in
              Ocala, Florida, serving homeowners and small businesses in Ocala,
              Belleview, The Villages, and surrounding Central Florida
              communities.
            </p>

            <p className="text-lg mt-4 text-gray-700 dark:text-gray-300">
              We believe technology should make life easier, not more
              stressful. That is why we focus on secure home and small business
              networks, scam prevention, malware and virus cleanup, device
              troubleshooting, and honest guidance you can actually understand.
            </p>

            <p className="text-lg mt-4 text-gray-700 dark:text-gray-300">
              Whether you need in-home help, on-site business support, or
              remote IT assistance, our goal is simple: deliver practical,
              security-first solutions without upsells, scare tactics, or
              confusing tech jargon.
            </p>
          </section>

          <section aria-labelledby="core-values">
            <h2
              id="core-values"
              className="text-2xl md:text-3xl font-semibold mb-4"
            >
              Our Core Values
            </h2>
            <RenderValues />
          </section>

          <section
            aria-labelledby="why-different"
            className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_58%)] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md dark:border-slate-700/70 dark:bg-slate-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.09),transparent_60%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5"
          >
            <h2
              id="why-different"
              className="text-2xl md:text-3xl font-semibold mb-4 flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-sky-200/80 bg-sky-100/85 shadow-[0_8px_18px_rgba(59,130,246,0.12)] dark:border-sky-400/14 dark:bg-slate-800/88 dark:shadow-[0_10px_22px_rgba(2,132,199,0.14)]">
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
              Why We&apos;re Different
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Defend I.T. Solutions combines real cybersecurity knowledge with
              practical, hands-on IT support. From securing smart homes and
              Wi-Fi networks to cleaning infected computers and helping small
              businesses stay protected, we deliver trusted local service
              backed by real-world security experience.
            </p>
          </section>

          {/* Services CTA */}
          <section className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/76 p-8 text-center shadow-[0_16px_38px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md dark:border-sky-400/18 dark:bg-slate-950/74 dark:shadow-[0_22px_48px_rgba(2,6,23,0.36)] dark:ring-white/5">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.06),transparent_54%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_52%)]" />
            <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Explore Our Services
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              From computer repair to network security, we offer comprehensive
              IT solutions tailored to your needs.
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 dark:border dark:border-sky-400/18 dark:bg-sky-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.14),transparent_62%)] dark:shadow-[0_14px_28px_rgba(2,132,199,0.18)] dark:ring-1 dark:ring-white/5 dark:backdrop-blur-sm dark:hover:-translate-y-0.5 dark:hover:border-sky-400/28 dark:hover:bg-sky-900/72 dark:hover:shadow-[0_18px_34px_rgba(2,132,199,0.24)] text-white font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              View All Services
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
            </div>
          </section>

          <BookOnline />
        </div>
      </PageContainer>
    </>
  );
}
