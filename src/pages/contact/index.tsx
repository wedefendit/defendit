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
  MessageSquare,
} from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

const { contact, name } = companyInfo;
const { phone, email, address, gpg, service_email } = contact;
const { street, city, state, zip } = address;
const { fingerprint, key_id, key_url, secure_email } = gpg;

function HeadingSection() {
  return (
    <header className="text-center space-y-2 my-4">
      <h1 className="text-4xl sm:text-5xl font-bold">
        Contact Us in Ocala, The Villages & Belleview
      </h1>
      <h2 className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mt-2 mb-6">
        {name} provides remote and on-site support across Central Florida.
      </h2>
    </header>
  );
}

function PrimaryContact() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 p-8 bg-blue-50 dark:bg-slate-800/50 rounded-lg border-2 border-blue-200 dark:border-sky-600">
      <Phone className="w-16 h-16 text-blue-600 dark:text-sky-400" />
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Call or Text Us
        </h2>
        <a
          href={`tel:${phone.replace(/[^0-9]/g, "")}`}
          className="block text-3xl font-bold text-blue-600 dark:text-sky-400 hover:underline"
        >
          {phone.replace("+1", "")}
        </a>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Available for calls and text messages
        </p>
      </div>
    </div>
  );
}

function ContactInfoCard() {
  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-slate-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Other Ways to Reach Us
      </h3>

      <div className="space-y-4">
        {/* Standard Email */}
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-blue-500 dark:text-sky-400 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Standard Email
            </h4>
            <a
              href={`mailto:${email}`}
              className="text-blue-600 dark:text-sky-400 hover:underline text-sm break-all"
            >
              {email}
            </a>
          </div>
        </div>

        {/* Service Email */}
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-blue-500 dark:text-sky-400 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Service Requests
            </h4>
            <a
              href={`mailto:${service_email}`}
              className="text-blue-600 dark:text-sky-400 hover:underline text-sm break-all"
            >
              {service_email}
            </a>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <MapPin className="w-5 h-5 text-blue-500 dark:text-sky-400 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
              Mailing Address
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Mailing address only • We operate on-site or remotely
            </p>
            <address className="text-sm not-italic leading-relaxed text-gray-700 dark:text-gray-300">
              <strong>{name}</strong>
              <br />
              {street}
              <br />
              {city}, {state} {zip}
            </address>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecureContactCard({
  showPGP,
  setShowPGP,
}: {
  showPGP: boolean;
  setShowPGP: (v: boolean) => void;
}) {
  return (
    <section
      id="pgp"
      className="p-6 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-slate-800/50 dark:to-slate-700/30 rounded-lg border border-blue-200 dark:border-sky-700"
    >
      <div className="flex items-start gap-4">
        <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-sky-400 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Need Secure Communication?
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            For sensitive inquiries, we support PGP-encrypted email
            communication.
          </p>

          <button
            type="button"
            onClick={() => setShowPGP(!showPGP)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-blue-600 dark:bg-sky-600 text-white text-sm font-medium shadow hover:bg-blue-700 dark:hover:bg-sky-700 transition"
            aria-controls="pgp-panel"
            aria-expanded={showPGP}
          >
            {showPGP ? "Hide" : "Show"} PGP Details
            {showPGP ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showPGP && (
            <div
              id="pgp-panel"
              className="mt-6 space-y-4 text-sm text-gray-700 dark:text-gray-300 p-4 bg-white dark:bg-slate-800 rounded border border-gray-200 dark:border-gray-700"
            >
              <div>
                <p className="font-semibold mb-1">Secure Email Address:</p>
                <a
                  href={`mailto:${secure_email}`}
                  className="text-blue-600 dark:text-sky-400 hover:underline break-all"
                >
                  {secure_email}
                </a>
              </div>

              <div>
                <a
                  href={key_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-block px-4 py-2 rounded bg-blue-600 dark:bg-sky-600 text-white font-medium text-sm shadow hover:bg-blue-700 dark:hover:bg-sky-700 transition"
                >
                  Download Public PGP Key
                </a>
              </div>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="font-semibold mb-1">Key ID:</p>
                <CopyableCode text={key_id} />
              </div>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Fingerprint className="w-4 h-4" />
                  <p className="font-semibold">Fingerprint:</p>
                </div>
                <CopyableCode text={fingerprint.replace(/\s+/g, "")} />
              </div>
            </div>
          )}
        </div>
      </div>
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
        title="Contact Defend I.T. Solutions | Ocala, The Villages & Belleview"
        description="Contact Defend I.T. Solutions for IT and cybersecurity support in Ocala, The Villages, and Belleview, FL. Phone, email, or secure PGP communication available."
        keywords="contact IT support Ocala FL, cybersecurity contact The Villages, IT services Belleview FL, secure contact PGP, local tech support Central Florida"
        structuredData={{ "@graph": [breadcrumbLd, contactPageLd] }}
      />

      <PageContainer>
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
          <BreadCrumbs
            includeJsonLd={true}
            items={[{ name: "Home", href: "/" }, { name: "Contact" }]}
          />

          <HeadingSection />

          {/* Main Contact Section - Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-8">
            <PrimaryContact />
            <ContactInfoCard />
          </div>

          {/* Secure Contact Section */}
          <SecureContactCard showPGP={showPGP} setShowPGP={setShowPGP} />

          {/* Contact Form */}
          <section className="p-6 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-slate-800/50 dark:to-slate-700/30 rounded-lg border border-blue-200 dark:border-sky-700">
            <div className="flex items-start gap-4">
              <MessageSquare className="w-8 h-8 text-blue-600 dark:text-sky-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Send Us a Message
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Have a question about our services, SIGINT, or anything else?
                  Fill out the form below and we&apos;ll get back to you.
                </p>
                <ContactForm className="max-w-xl mx-auto" />
              </div>
            </div>
          </section>

          {/* Service Area */}
          <ServiceAreaAndBooking />
        </div>
      </PageContainer>
    </>
  );
}
