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

import { Phone, Mail } from "lucide-react";
import data from "../../data/company-info.json";
import TrustStrip from "./TrustStrip";

const contact = data.contact;
const services_cta = data.services_cta || {};

export function BookOnline() {
  const tel = `+${contact.phone.replace(/[^0-9]/g, "")}`;
  const displayPhone = contact.phone.replace("+1", "");

  return (
    <section
      id="schedule-service"
      className="text-center text-[15px] leading-6 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 "
    >
      <div className="max-w-xl mx-auto my-12 px-4 rounded-lg border border-gray-200 dark:border-gray-900 bg-gray-50/40 dark:bg-gray-900/40 p-4 sm:p-6 shadow-sm dark:shadow-gray-800 space-y-3 sm:space-y-4 mt-16 ">
        <header>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Need to Schedule Service?
          </h2>
          <p className="-mb-2">
            Book by phone, email, or use Calendly to pick a time.
          </p>
        </header>

        <TrustStrip />

        <div className="mt-1 text-gray-600 dark:text-gray-400 sm:flex sm:justify-center">
          <ul className="list-none space-y-1">
            <li>
              <span className="font-semibold">Mon-Fri:</span> 9:00 AM - 6:00 PM
            </li>
            <li>
              <span className="font-semibold">Sat:</span> 10:00 AM - 4:00 PM
            </li>
          </ul>
        </div>

        <ul role="list" className="mt-3 sm:mt-4 space-y-3 sm:space-y-2">
          <li className="flex items-center gap-3">
            <Phone
              className="w-4 h-4 text-blue-600 dark:text-sky-400"
              aria-hidden="true"
            />
            <a
              href={`tel:${tel.replace(/[^0-9]/g, "")}`}
              className="text-blue-600 dark:text-sky-400 hover:underline break-words"
              aria-label={`Call ${displayPhone}`}
            >
              {displayPhone}
            </a>
          </li>
          <li className="flex items-center gap-3">
            <Mail
              className="w-4 h-4 text-blue-600 dark:text-sky-400"
              aria-hidden="true"
            />
            <a
              href={`mailto:${contact.service_email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-sky-400 hover:underline break-words"
              aria-label={`Email ${contact.service_email}`}
            >
              {contact.service_email}
            </a>
          </li>
        </ul>

        <details className="group mt-2 sm:mt-3">
          <summary className="cursor-pointer text-blue-600 dark:text-sky-400 hover:underline list-none select-none">
            Book online with Calendly
          </summary>

          <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3 space-y-3">
            <p className="text-gray-600 dark:text-gray-400">
              You will be redirected to Calendly to choose a time. By
              continuing, you agree to Calendly&apos;s terms and privacy policy.
            </p>

            <a
              href={services_cta.booking_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full sm:w-auto text-center px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition dark:bg-sky-500 dark:hover:bg-sky-600"
            >
              Continue to Booking
            </a>
          </div>
        </details>
      </div>
    </section>
  );
}
