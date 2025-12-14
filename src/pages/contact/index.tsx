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
/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import { useEffect, useState } from "react";
import { localBusinessLd } from "@/lib/json-ld";
import companyInfo from "../../../data/company-info.json";
import {
  Meta,
  BreadCrumbs,
  CopyableCode,
  PageContainer,
  ServiceAreaAndBooking,
} from "@/components";
import {
  Mail,
  Phone,
  MapPin,
  ChevronUp,
  Fingerprint,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";

const { contact, name } = companyInfo;
const { phone, email, address, gpg, service_email } = contact;
const { street, city, state, zip } = address;
const { fingerprint, key_id, key_url, secure_email } = gpg;

function HeadingSection() {
  return (
    <header className="text-center space-y-2 my-4">
      <h1 className="text-4xl sm:text-5xl font-bold">Contact Us</h1>
      <h2 className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mt-2 mb-6">
        {name} provides remote and on-site support.
      </h2>
    </header>
  );
}

function ContactGrid() {
  return (
    <section className="flex flex-wrap flex-col md:flex-row items-center justify-center gap-6 sm:gap-12 max-w-3xl mx-auto">
      <div className="flex flex-col items-center text-center space-y-2 mt-4 md:mt-16">
        <Phone className="w-6 h-6 text-blue-500 dark:text-sky-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Call or Text
        </h2>
        <a
          href={`tel:${phone.replace(/[^0-9]/g, "")}`}
          className="text-blue-600 dark:text-sky-400 hover:underline text-lg"
        >
          {phone.replace("+1", "")}
        </a>
      </div>

      <div className="flex flex-col items-center text-center space-y-2 md:mt-16">
        <Mail className="w-6 h-6 text-blue-500 dark:text-sky-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Standard Email
        </h2>
        <a
          href={`mailto:${email}`}
          className="text-blue-600 dark:text-sky-400 hover:underline text-sm"
        >
          {email}
        </a>
      </div>

      <div className="flex flex-col items-center text-center space-y-2 md:mt-16">
        <Mail className="w-6 h-6 text-blue-500 dark:text-sky-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Service Email
        </h2>
        <a
          href={`mailto:${service_email}`}
          className="text-blue-600 dark:text-sky-400 hover:underline text-sm"
        >
          {service_email}
        </a>
      </div>

      <div className="flex flex-col items-center text-center space-y-2 sm:col-span-2">
        <MapPin className="w-6 h-6 text-blue-500 dark:text-sky-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Mailing Address
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This is a mailing address only. We operate on-site or remotely.
        </p>
        <p className="text-base leading-tight select-all">
          <strong>{name}</strong>
          <br />
          {street}
          <br />
          {city}, {state} {zip}
        </p>
      </div>
    </section>
  );
}

function PgpBlock({
  showPGP,
  setShowPGP,
}: {
  showPGP: boolean;
  setShowPGP: (v: boolean) => void;
}) {
  return (
    <section id="pgp" className="text-center space-y-4">
      <p className="text-md text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Reach out securely below.
      </p>

      <button
        type="button"
        onClick={() => setShowPGP(!showPGP)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded bg-blue-600 dark:bg-sky-500 text-white font-medium shadow hover:bg-blue-700 dark:hover:bg-sky-600 transition"
        aria-controls="pgp-panel"
      >
        <ShieldCheck className="w-5 h-5" />
        Secure Contact (PGP)
        {showPGP ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {showPGP && (
        <div
          id="pgp-panel"
          className="mt-6 space-y-4 text-sm text-gray-700 dark:text-gray-300 max-w-xl mx-auto border border-gray-300 dark:border-gray-700 rounded-lg p-4"
        >
          <p>
            For sensitive inquiries, you may email us securely at:
            <br />
            <a
              href={`mailto:${secure_email}`}
              className="text-blue-600 dark:text-sky-400 hover:underline"
            >
              {secure_email}
            </a>
          </p>

          <a
            href={key_url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-block px-3 py-1 rounded bg-blue-600 dark:bg-sky-500 text-white font-medium shadow hover:bg-blue-700 dark:hover:bg-sky-600 transition"
          >
            Download Public PGP Key
          </a>

          <p>
            <strong>Key ID:</strong> <CopyableCode text={key_id} />
          </p>

          <div className="flex flex-col items-center gap-1 text-gray-500 dark:text-gray-400">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
              <Fingerprint className="w-4 h-4" />
              <CopyableCode text={fingerprint.replace(/\s+/g, "")} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

const canonical = "https://www.wedefendit.com/contact";

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
    { "@type": "ListItem", position: 2, name: "Contact", item: canonical },
  ],
};

const contactPageLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Defend I.T. Solutions",
  url: canonical,
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: "https://www.wedefendit.com/og-image.png",
  },
  about: {
    ...localBusinessLd,
    areaServed: [
      "Ocala FL",
      "Belleview FL",
      "The Villages FL",
      "Central Florida",
      "Remote",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: contact.phone,
      contactType: "Customer Service",
      availableLanguage: "English",
      email: contact.email,
      serviceUrl: "https://www.wedefendit.com/services",
      url: canonical,
    },
  },
};

export default function ContactPage() {
  const [showPGP, setShowPGP] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (
      url.searchParams.get("secure") === "1" ||
      url.hash.replace("#", "") === "pgp"
    ) {
      setShowPGP(true);
      const el = document.getElementById("pgp");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <>
      <Meta
        url={canonical}
        canonical={canonical}
        image="https://www.wedefendit.com/og-image.png"
        title="Contact Defend I.T. Solutions | IT & Cybersecurity Support in Ocala, Belleview & The Villages"
        description="Contact Defend I.T. Solutions for local, trusted IT and cybersecurity support in Ocala, Belleview, The Villages, and Central Florida, including secure PGP communication options."
        keywords="contact IT support Ocala FL, cybersecurity contact Belleview FL, IT services The Villages FL, secure contact PGP, local tech support Central Florida"
        structuredData={{ "@graph": [breadcrumbLd, contactPageLd] }}
      />

      <PageContainer>
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-12 bg-gray-50/10 dark:bg-slate-950/20 z-0 shadow-md">
          <BreadCrumbs
            includeJsonLd={true}
            items={[{ name: "Home", href: "/" }, { name: "Contact" }]}
          />
          <HeadingSection />
          <ContactGrid />
          <PgpBlock showPGP={showPGP} setShowPGP={setShowPGP} />
          <ServiceAreaAndBooking />
        </div>
      </PageContainer>
    </>
  );
}
