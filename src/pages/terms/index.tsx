/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.

This software and its source code are the proprietary property of
Defend I.T. Solutions LLC and are protected by United States and
international copyright laws. Unauthorized reproduction, distribution,
modification, display, or use of this software, in whole or in part, without the
prior written permission of Defend I.T. Solutions LLC, is strictly prohibited.

This software is provided for use only by authorized employees, contractors, or
licensees of Defend I.T. Solutions LLC and may not be disclosed to any third
party without express written consent.
*/

import Head from "next/head";
import { LegalPage } from "@/components";
import data from "../../../data/company-info.json";

const { phone, email, address } = data.contact || {};
const { street, city, state, zip } = address || {};

export default function Terms() {
  return (
    <>
      <Head>
        <title>Website Terms & Conditions | Defend I.T. Solutions</title>
        <meta
          name="description"
          content="These Terms and Conditions govern use of the Defend I.T. Solutions website. Read about usage rights, disclaimers, and legal protections."
        />
        <meta name="robots" content="noindex, follow" />
        <meta
          property="og:title"
          content="Website Terms & Conditions | Defend I.T."
        />
        <meta
          property="og:description"
          content="Understand your rights and responsibilities when using this website. Simple, fair terms written for humans."
        />
        <meta property="og:url" content="https://www.wedefendit.com/terms" />
        <meta property="og:type" content="article" />
        <meta
          property="og:image"
          content="https://www.wedefendit.com/og-image.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Website Terms & Conditions | Defend I.T."
        />
        <meta
          name="twitter:description"
          content="These terms cover acceptable use of this website and related content."
        />
        <meta
          name="twitter:image"
          content="https://www.wedefendit.com/og-image.png"
        />

        <link rel="canonical" href="https://www.wedefendit.com/terms" />
        <meta
          name="keywords"
          content="Defend I.T. Solutions, terms and conditions, website terms, legal terms, cybersecurity, IT support, Ocala, The Villages"
        />
      </Head>
      <LegalPage>
        <h1 className="text-3xl font-bold text-center border-b pb-4 mb-6 uppercase tracking-wider underline">
          Terms and Conditions
        </h1>

        <p className="mb-6">
          These terms and conditions (the &quot;Terms and Conditions&quot;)
          govern the use of <strong>www.wedefendit.com</strong> (the
          &quot;Site&quot;). This Site is owned and operated by Defend I.T.
          Solutions LLC. It is a service-based business website offering IT
          support, cybersecurity services, and a security appliance for
          residential and small business clients.
        </p>

        <p className="mb-6">
          By using this Site, you agree that you have read and understand these
          Terms and Conditions and agree to abide by them at all times.
          <br />
          <strong className="uppercase">
            These Terms and Conditions contain a dispute resolution clause that
            impacts your rights about how to resolve disputes. Please read it
            carefully.
          </strong>
        </p>

        <h2 className="text-xl font-bold uppercase border-b my-4">
          Intellectual Property
        </h2>
        <p>
          All content published and made available on our Site is the property
          of Defend I.T. Solutions LLC and the Site&apos;s creators. This
          includes but is not limited to images, text, logos, documents,
          downloadable files and anything that contributes to the composition of
          our Site.
        </p>

        <h2 className="text-xl font-bold uppercase border-b my-4">
          Age Restrictions
        </h2>
        <p>
          The minimum age to use our Site is 18 years old. By using this Site,
          users agree they are over 18. We do not assume legal responsibility
          for false age claims.
        </p>

        <h2 className="text-xl font-bold uppercase border-b my-4">
          Acceptable Use
        </h2>
        <p>You agree to use our Site legally and not to:</p>
        <ul className="list-disc ml-6 my-2">
          <li>Harass or mistreat other users</li>
          <li>Violate others&apos; rights</li>
          <li>Violate intellectual property rights</li>
          <li>Hack another user&apos;s account</li>
          <li>Engage in fraudulent behavior</li>
          <li>Post offensive/inappropriate material</li>
          <li>Attempt unauthorized access or reverse-engineer functionality</li>
        </ul>
        <p>
          If we believe you are violating these Terms, we may suspend or
          terminate access and pursue legal action.
        </p>

        <h2 className="text-xl font-bold uppercase border-b my-4">
          Limitation of Liability
        </h2>
        <p>
          Defend I.T. Solutions LLC and affiliates are not liable for any
          claims, damages, or expenses arising from your use of the Site.
        </p>

        <h2 className="text-xl font-bold uppercase border-b my-4">Indemnity</h2>
        <p>
          You agree to indemnify and hold harmless Defend I.T. Solutions LLC and
          affiliates from claims and liabilities arising from your use of the
          Site or violation of these Terms.
        </p>

        <h2 className="text-xl font-bold uppercase border-b my-4">
          Applicable Law
        </h2>
        <p>These Terms are governed by the laws of the State of Florida.</p>

        <h2 className="text-xl font-bold uppercase border-b my-4">
          Dispute Resolution
        </h2>
        <p>
          If disputes arise, you agree to first seek mediation, followed by
          binding arbitration if necessary. Both parties will share costs
          equally.
        </p>
        <p>
          You retain the right to bring claims in small claims court or for
          injunctive relief or intellectual property matters.
        </p>

        <h2 className="text-xl font-bold uppercase border-b my-4">
          Additional Terms
        </h2>
        <ul className="list-disc ml-6 my-2">
          <li>
            <strong>Service Scope Disclaimer:</strong> Info is general and not a
            service guarantee. Actual services are subject to assessment and
            agreement.
          </li>
          <li>
            <strong>Right to Refuse Access:</strong> We may block users
            violating terms or engaging in abuse.
          </li>
          <li>
            <strong>Security Notice:</strong> Unauthorized access attempts will
            result in legal action.
          </li>
          <li>
            <strong>No Warranty:</strong> Services are provided “as is” with no
            warranties or guarantees.
          </li>
          <li>
            <strong>Third-Party Links:</strong> We are not responsible for
            content or policies of external sites.
          </li>
        </ul>

        <h2 className="text-xl font-bold uppercase border-b my-4">
          Severability
        </h2>
        <p>
          If any term is invalid under applicable law, it will be removed. The
          rest remain in effect.
        </p>

        <h2 className="text-xl font-bold uppercase border-b my-4">Changes</h2>
        <p>
          These Terms may be updated. We&apos;ll notify users via email or post
          changes on the Site.
        </p>

        <h2 className="text-xl font-bold uppercase border-b my-4">
          Contact Details
        </h2>
        <p>
          For questions or concerns, contact us at:
          <br />
          <a
            href={`mailto:${email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {email}
          </a>
          <br />
          <a
            href={`tel:+${phone.replace(/[^0-9]/g, "")}`}
            className="text-blue-600 underline"
          >
            {phone}
          </a>
          {address && (
            <>
              <br />
              <span className="text-gray-600 dark:text-gray-400">
                {street}, {city}, {state} {zip}
              </span>
            </>
          )}
        </p>
        <p className="text-left mt-8">
          <strong>Effective Date:</strong> 13th day of May, 2026
        </p>
      </LegalPage>
    </>
  );
}
