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

import { Phone, Mail, Calendar } from "lucide-react";
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
      className="border-t border-gray-200 dark:border-gray-700"
    >
      <div className="max-w-2xl mx-auto my-12 px-4">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/74 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_58%)] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md dark:border-slate-700/70 dark:bg-slate-950/62 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.1),transparent_60%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5 space-y-6">
          {/* Header */}
          <header className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Schedule Service
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Mon-Fri: 9 AM - 6 PM • Sat: 10 AM - 4 PM
            </p>
          </header>

          <TrustStrip />

          {/* Primary Actions */}
          <div className="space-y-3">
            {/* Call/Text - Primary */}
            <a
              href={`tel:${tel.replace(/[^0-9]/g, "")}`}
              className="group flex items-center gap-3 rounded-lg bg-blue-600 p-4 text-white font-medium shadow-sm transition hover:bg-blue-700 dark:border dark:border-sky-400/18 dark:bg-sky-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.14),transparent_62%)] dark:shadow-[0_14px_28px_rgba(2,132,199,0.18)] dark:ring-1 dark:ring-white/5 dark:backdrop-blur-sm dark:hover:-translate-y-0.5 dark:hover:border-sky-400/28 dark:hover:bg-sky-900/72 dark:hover:shadow-[0_18px_34px_rgba(2,132,199,0.24)]"
            >
              <Phone className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              <div className="flex-1 text-left">
                <div className="text-sm opacity-90">Call or Text</div>
                <div className="text-lg font-bold">{displayPhone}</div>
              </div>
            </a>

            {/* Email - Secondary */}
            <a
              href={`mailto:${contact.service_email}`}
              className="group flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white/68 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.06)] ring-1 ring-white/65 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-white/82 hover:shadow-[0_16px_32px_rgba(15,23,42,0.1)] dark:border-slate-700/70 dark:bg-slate-900/58 dark:ring-white/5 dark:hover:border-sky-400/28 dark:hover:bg-slate-900/72 dark:hover:shadow-[0_20px_38px_rgba(2,6,23,0.32)]"
            >
              <Mail
                className="w-5 h-5 text-blue-700 dark:text-sky-300 flex-shrink-0"
                aria-hidden="true"
              />
              <div className="flex-1 text-left">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Send Email
                </div>
                <div className="font-medium break-all text-blue-700 dark:text-sky-300">
                  {contact.service_email}
                </div>
              </div>
            </a>
          </div>

          {/* Calendly - Tertiary */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <details className="group">
              <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-sky-400 list-none flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Or book online with Calendly</span>
              </summary>

              <div className="mt-3 pl-6">
                <a
                  href={services_cta.booking_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm text-blue-600 dark:text-sky-400 hover:underline"
                >
                  Continue to Calendly →
                </a>
              </div>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}
