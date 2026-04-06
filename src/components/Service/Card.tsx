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
import * as Icons from "lucide-react";

export type ServiceCardProps = {
  id: string;
  title: string;
  headline: string;
  icons: string[];
  summary: string;
  cta: string;
  slug?: string;
  remote?: boolean;
};

function toSlug(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ServiceCard({
  id,
  title,
  summary,
  icons,
  slug,
  remote,
  cta,
}: ServiceCardProps) {
  const finalSlug = slug || id || toSlug(title);
  const isRemote = remote || false;
  const href = `/services/${isRemote ? `remote/${finalSlug}` : finalSlug}`;

  return (
    <Link
      href={href}
      className="group relative flex min-h-[300px] flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white/72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_58%)] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-white/84 hover:shadow-[0_18px_38px_rgba(15,23,42,0.12)] dark:border-slate-700/70 dark:bg-slate-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.09),transparent_60%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5 dark:hover:border-sky-400/30 dark:hover:bg-slate-900/74 dark:hover:shadow-[0_24px_46px_rgba(2,6,23,0.36)]"
    >
      {/* Icon Section */}
      <div className="flex items-center gap-3 mb-4">
        {icons.map((iconName, idx) => {
          const name = iconName
            .split("-")
            .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
            .join("");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const LucideIcon = (Icons as any)[name];
          return LucideIcon ? (
            <div
              key={idx}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-sky-200/80 bg-sky-100/85 shadow-[0_8px_18px_rgba(59,130,246,0.12)] transition-transform duration-300 group-hover:scale-110 dark:border-sky-400/14 dark:bg-slate-800/88 dark:shadow-[0_10px_22px_rgba(2,132,199,0.14)]"
            >
              <LucideIcon className="w-6 h-6 text-blue-700 dark:text-sky-300" />
            </div>
          ) : null;
        })}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>

      {/* Summary - Grows to fill space */}
      <p className="mb-4 flex-grow text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {summary}
      </p>

      {/* CTA - Fixed at bottom */}
      <div className="border-t border-slate-200/70 pt-4 dark:border-slate-700/70">
        <span className="flex items-center gap-2 text-sm font-medium text-blue-700 transition-all group-hover:gap-3 group-hover:text-blue-800 dark:text-sky-300 dark:group-hover:text-sky-200">
          {cta || "Learn More"}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export default ServiceCard;
