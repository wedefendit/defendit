import Link from "next/link";
import React, { useState } from "react";
import companyInfo from "../../data/company-info.json";

const { copy, contact, copy_start_year } = companyInfo;

const commonServices = [
  "computer-repair",
  "custom-solutions",
  "data-recovery",
  "home-network-security",
  "network-setup",
  "onsite-tech-support",
  "password-management",
  "pc-upgrades",
  "scam-protection",
  "smart-home-setup",
  "software-troubleshooting",
  "virus-removal",
];

const remoteServices = [
  "remote-support-plan",
  "remote-support",
  "remote-privacy-hardening",
  "remote-security-assessment",
  "remote-tech-tutoring",
  "remote-training",
  "remote-virus-removal",
];

const formatLabel = (slug: string) =>
  slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

const formatCopyYear = (line: string) => {
  const currentYear = new Date().getFullYear();
  const startYear = copy_start_year || currentYear;

  if (startYear >= currentYear) {
    return line.replace("{{year}}", `${currentYear}`);
  }

  // otherwise, return a range
  return line.replace("{{year}}", `${startYear}-${currentYear}`);
};

const AccordionSection: React.FC<{
  title: string;
  id: "services" | "remote" | "company" | "legal";
  openSection: string | null;
  setOpenSection: React.Dispatch<
    React.SetStateAction<"services" | "remote" | "company" | "legal" | null>
  >;
  children: React.ReactNode;
}> = ({ title, id, openSection, setOpenSection, children }) => (
  <div>
    <button
      type="button"
      className="w-full flex items-center justify-between px-4 py-3 text-gray-800 dark:text-white text-sm"
      onClick={() => setOpenSection(openSection === id ? null : id)}
    >
      <span className="font-semibold">{title}</span>
      <span className="text-blue-500 dark:text-sky-400">
        {openSection === id ? "−" : "+"}
      </span>
    </button>
    {openSection === id && <div className="px-4 pb-3">{children}</div>}
  </div>
);

const DesktopColumn: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div>
    <h4 className="font-semibold mb-3 text-gray-800 dark:text-white">
      {title}
    </h4>
    <ul className="space-y-2">{children}</ul>
  </div>
);

const ServiceLinks: React.FC<{
  services: string[];
  isMobile?: boolean;
  isRemote?: boolean;
}> = ({ services, isMobile = false, isRemote = false }) => {
  const fontSizeClass = isMobile ? "text-xs" : "text-sm";

  return (
    <>
      {services.map((service) => (
        <li key={service}>
          <Link
            href={`/services/${isRemote ? `remote/${service}` : service}`}
            className={`text-blue-500 dark:text-sky-600 dark:hover:text-sky-500 hover:underline ${fontSizeClass}`}
          >
            {formatLabel(service)}
          </Link>
        </li>
      ))}
    </>
  );
};

export const Footer: React.FC = () => {
  const [openSection, setOpenSection] = useState<
    null | "services" | "remote" | "company" | "legal"
  >(null);

  return (
    <footer className="w-full max-w-8xl p-6 mt-12 text-gray-500 dark:text-gray-400 text-xs md:text-sm border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="rounded-lg md:hidden divide-y divide-gray-800">
          <AccordionSection
            title="Services"
            id="services"
            openSection={openSection}
            setOpenSection={setOpenSection}
          >
            <ul className="space-y-2">
              <ServiceLinks isMobile services={commonServices} />
            </ul>
          </AccordionSection>

          <AccordionSection
            title="Remote Services"
            id="remote"
            openSection={openSection}
            setOpenSection={setOpenSection}
          >
            <ul className="space-y-2">
              <ServiceLinks services={remoteServices} isMobile isRemote />
            </ul>
          </AccordionSection>

          <AccordionSection
            title="Company"
            id="company"
            openSection={openSection}
            setOpenSection={setOpenSection}
          >
            <ul className="space-y-2">
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/sigint">SIGINT Dashboard</Link>
              </li>
              <li>
                <Link href="/awareness">Awareness</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </AccordionSection>

          <AccordionSection
            title="Legal"
            id="legal"
            openSection={openSection}
            setOpenSection={setOpenSection}
          >
            <ul className="space-y-2">
              <li>
                <Link href="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms">Terms of Service</Link>
              </li>
            </ul>
          </AccordionSection>
        </div>

        <div className="hidden md:block">
          <div className="px-6 py-4 flex justify-around gap-10">
            <DesktopColumn title="Services">
              <ServiceLinks services={commonServices} />
            </DesktopColumn>

            <DesktopColumn title="Remote Services">
              <ServiceLinks services={remoteServices} isRemote={true} />
            </DesktopColumn>

            <DesktopColumn title="Company">
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/sigint">SIGINT Dashboard</Link>
              </li>
              <li>
                <Link href="/awareness">Awareness</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </DesktopColumn>

            <DesktopColumn title="Legal">
              <li>
                <Link href="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms">Terms of Service</Link>
              </li>
            </DesktopColumn>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 text-xs text-center md:flex-row md:justify-center">
          {contact.phone && (
            <a href={`tel:${contact.phone.replace(/[^0-9]/g, "")}`}>
              {contact.phone.replace("+1", "")}
            </a>
          )}
          {contact.email && (
            <>
              <span className="hidden md:inline px-1">•</span>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </>
          )}
          {contact.address && (
            <>
              <span className="hidden md:inline px-1">•</span>
              <span>
                {`${contact.address.street}, ${contact.address.city}, ${contact.address.state} ${contact.address.zip}`}
              </span>
            </>
          )}
        </div>

        <div className="text-center space-y-1 text-gray-400 dark:text-gray-500">
          {copy.map((line: string, i: number) => (
            <p key={i} className="text-[0.7rem]">
              {formatCopyYear(line)}
            </p>
          ))}
        </div>
      </div>
    </footer>
  );
};
