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
import { localBusinessLd } from "@/lib/json-ld";
import type { ComponentType, SVGProps } from "react";
import { ShieldCheck, MapPin, MessageCircle } from "lucide-react";
import { PageContainer, Meta, BookOnline, BreadCrumbs } from "@/components";

const valueData = [
  {
    title: "Security First",
    description:
      "Your data and privacy are our top priority. We implement modern protections tailored to your environment.",
    icon: ShieldCheck,
  },
  {
    title: "Local & Personal",
    description:
      "No call centers or bots. Just real humans helping real people, in person across Ocala, Belleview, and The Villages.",
    icon: MapPin,
  },
  {
    title: "Clear, Honest Support",
    description:
      "No tech-speak walls. We explain things in plain English and only recommend what you actually need.",
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
    <article className="flex flex-col items-start justify-center gap-4">
      <header className="flex flex-wrap items-center gap-4 w-full">
        <Icon
          className="w-7 h-7 md:w-10 md:h-10 text-blue-500 dark:text-sky-400"
          aria-hidden="true"
        />
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold">
          {title}
        </h3>
      </header>
      <p className="text-gray-700 dark:text-gray-400 pl-9 md:pl-12">
        {description}
      </p>
    </article>
  );
}

function RenderValues() {
  return (
    <ul className="space-y-6 pl-2" role="list">
      {valueData.map((item) => (
        <li key={item.title}>
          <ValueItem
            title={item.title}
            description={item.description}
            Icon={item.icon}
          />
        </li>
      ))}
    </ul>
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

          <header className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold">
              About Defend I.T. Solutions
            </h1>
            <p className="mt-3 text-lg text-blue-500 dark:text-sky-400 w-[80%] mx-auto">
              Local cybersecurity and IT support serving Ocala, Belleview, The
              Villages, and surrounding Central Florida.
            </p>
          </header>

          <section aria-labelledby="who-we-are">
            <p className="text-lg">
              <strong className="text-blue-500 dark:text-sky-400">
                Defend I.T. Solutions
              </strong>{" "}
              is a locally owned cybersecurity and tech support company based in
              Ocala, Florida, providing in-home, on-site, and remote IT services
              across Ocala, Belleview, The Villages, and nearby Central Florida
              communities.
            </p>

            <p className="text-lg mt-6">
              We believe technology should work for you, not against you, and we
              focus on secure networks, scam prevention, malware cleanup, and
              clear, honest guidance without upsells or scare tactics.
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

          <section aria-labelledby="why-different">
            <h2
              id="why-different"
              className="text-2xl md:text-3xl font-semibold mb-2"
            >
              Why We&apos;re Different
            </h2>
            <p className="text-lg mt-4">
              From securing smart homes to cleaning infected systems, we deliver
              practical, local solutions backed by real cybersecurity
              experience—not scripts or call centers.
            </p>
          </section>

          <BookOnline />
        </div>
      </PageContainer>
    </>
  );
}
