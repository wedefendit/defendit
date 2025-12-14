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
  Network,
  Laptop2,
  UserCheck,
  LucideIcon,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { localBusinessLd } from "@/lib/json-ld";
import companyInfo from "../../data/company-info.json";
import { Meta, PageContainer } from "@/components";

const { services_cta } = companyInfo;

function CallToActionButtons() {
  const base =
    "px-6 py-4 rounded-md font-semibold glow-hover transition-colors";
  const primary =
    "border border-black bg-blue-400 text-white dark:border-none dark:bg-gray-100 dark:text-black hover:bg-blue-500 hover:border-blue-700 hover:dark:bg-slate-700 hover:text-gray-100";
  const secondary =
    "border border-black dark:border-gray-200 text-black dark:text-white hover:bg-blue-500 hover:text-white hover:dark:bg-sky-500/60 hover:border-blue-700 hover:dark:border-sky-600";

  const getButtonConfig = (text: string, fallbackLink: string) => {
    const isViewServices = text.toLowerCase() === "view services";
    return {
      href: isViewServices ? "/services" : fallbackLink,
      className: `${base} ${isViewServices ? secondary : primary}`,
      ariaLabel: text,
    };
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-evenly gap-4 mt-6 w-auto p-3 text-sm md:text-xl break-keep">
      {services_cta.buttons.map(({ text, link }) => {
        const { href, className, ariaLabel } = getButtonConfig(text, link);
        return (
          <Link
            key={text}
            href={href}
            className={className}
            aria-label={ariaLabel}
          >
            {text}
          </Link>
        );
      })}
    </div>
  );
}

type ServiceLinkProps = {
  href: string;
  text: string;
  Icon: LucideIcon;
};

function ServiceLink({ href, text, Icon }: ServiceLinkProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center text-center max-w-[140px] sm:max-w-[200px] w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 dark:focus-visible:ring-sky-400/60"
      aria-label={text}
    >
      <Icon
        aria-hidden="true"
        className="h-10 w-10 mb-2 transition-colors text-gray-900 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-sky-400"
      />
      <strong className="text-blue-500 dark:text-sky-400 group-hover:underline underline-offset-4">
        {text}
      </strong>
    </Link>
  );
}

export default function Home() {
  const serviceLinks = [
    {
      text: "Cybersecurity",
      Icon: ShieldCheck,
      link: "/services/custom-solutions",
    },
    {
      text: "Network Support",
      Icon: Network,
      link: "/services/network-setup",
    },
    {
      text: "Tech Support",
      Icon: Laptop2,
      link: "/services/onsite-tech-support",
    },
    {
      text: "Personalized Service",
      Icon: UserCheck,
      link: "/services/custom-solutions",
    },
  ];

  return (
    <>
      <Meta
        title="Defend I.T. Solutions | Cybersecurity & IT Support"
        description="Defend I.T. Solutions provides professional cybersecurity and I.T. support for homeowners, retirees, and small businesses."
        image="https://www.wedefendit.com/og-image.png"
        url="https://www.wedefendit.com/"
        canonical="https://www.wedefendit.com/"
        keywords="cybersecurity, IT support, small business IT, home tech support, network security, computer repair, online safety"
        structuredData={localBusinessLd}
      />

      <PageContainer>
        <header className="text-center p-2 -mt-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight max-w-4xl mx-auto">
            Cybersecurity Support You Can Trust
          </h1>
          <h2 className="mt-2 text-md sm:text-xl md:text-2xl font-semibold text-blue-500 dark:text-sky-400 max-w-2xl mx-auto">
            Clear and practical solutions for homes and small businesses
          </h2>
        </header>

        <section
          id="common-services"
          aria-labelledby="services-heading"
          className="mt-6"
        >
          <h2
            id="services-heading"
            className="text-2xl font-bold text-center mb-6"
          >
            Our Core Services
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center mt-10">
            {serviceLinks.map((service) => (
              <ServiceLink
                key={service.text}
                href={service.link}
                text={service.text}
                Icon={service.Icon}
              />
            ))}
          </div>

          <p className="text-base md:text-lg text-gray-800 dark:text-gray-300 leading-normal max-w-3xl mx-auto px-6 text-center mt-8">
            We help protect devices, secure networks, remove malware, and solve
            everyday technology problems with transparency and clear
            communication.
          </p>

          {/* <p className="text-base md:text-lg text-gray-800 dark:text-gray-300 leading-normal max-w-3xl mx-auto px-6 text-center mt-6">
            No jargon. No hidden fees. Just reliable support.
          </p> */}
        </section>

        <section
          className="flex flex-col items-center justify-center w-full space-y-8"
          aria-labelledby="cta-heading"
        >
          {/* <h2
            id="cta-heading"
            className="text-2xl md:text-3xl font-bold text-center"
          >
            Need IT Help You Can Trust?
          </h2> */}

          <CallToActionButtons />
        </section>
      </PageContainer>
    </>
  );
}
