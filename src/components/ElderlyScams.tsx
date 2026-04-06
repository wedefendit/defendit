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

import React from "react";
import * as Icons from "lucide-react";
import data from "../../data/scams.json";

const elderly = data.elderly || [];

type ElderlyScamsListProps = {
  /** Show the internal header; set false if the page already has a section heading */
  showHeader?: boolean;
  /** Header text (used when showHeader is true) */
  title?: string;
  /** Optional extra classes for the outer section wrapper */
  className?: string;
};

function toPascalCase(icon: string) {
  return icon
    .split("-")
    .map((p) => (p ? p[0].toUpperCase() + p.slice(1) : p))
    .join("");
}

function getLucideIcon(name: string) {
  const key = toPascalCase(name) as keyof typeof Icons;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (Icons[key] as React.ComponentType<any>) || Icons.AlertCircle;
}

export const ElderlyScamsList: React.FC<ElderlyScamsListProps> = ({
  showHeader = true,
  title = "Top Financial Scams Targeting Older Adults",
}) => {
  return (
    <>
      {showHeader && (
        <header className="text-center mb-10">
          <h2
            id="elderly-scams-heading"
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-200 leading-tight"
          >
            {title}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            These Best Practices Help Protect Your Devices, Identity, and
            Personal Data From Cyber Threats.
          </p>
        </header>
      )}

      <div className={`grid grid-cols-1 gap-8 lg:grid-cols-2`}>
        {elderly.map(
          ({ icon: iconName, title, description, prevention }, i) => {
            const Icon = getLucideIcon(iconName);
            return (
              <article
                key={`${iconName}-${i}`}
                className="relative flex flex-col overflow-hidden rounded-xl border border-red-300/80 bg-white/78 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.11),transparent_58%)] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-white/75 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-red-400/90 hover:bg-white/88 hover:shadow-[0_18px_38px_rgba(15,23,42,0.12)] dark:border-red-400/16 dark:bg-slate-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.12),transparent_60%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5 dark:hover:border-red-400/28 dark:hover:bg-slate-900/74 dark:hover:shadow-[0_24px_46px_rgba(2,6,23,0.36)]"
              >
                <div className="mb-4 grid grid-cols-[4rem_minmax(0,1fr)_4rem] items-center gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border border-red-300/90 bg-red-100/95 shadow-[0_10px_22px_rgba(239,68,68,0.16)] dark:border-red-400/16 dark:bg-slate-800/88 dark:shadow-[0_10px_22px_rgba(239,68,68,0.12)]">
                    <Icon
                      className="w-8 h-8 text-red-800 dark:text-red-300"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-center text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                    {title}
                  </h3>
                  <div aria-hidden="true" className="h-16 w-16" />
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base mb-6 flex-grow leading-relaxed">
                  {description}
                </p>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-left text-gray-900 dark:text-gray-100 font-semibold mb-3 flex items-center gap-2">
                    <Icons.ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-500" />
                    How to Protect Yourself
                  </h4>
                  <ul
                    role="list"
                    className="text-gray-700 dark:text-gray-300 text-sm space-y-2"
                  >
                    {prevention.map((tip: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Icons.ShieldPlus
                          className="mt-[3px] flex-shrink-0 text-emerald-700 dark:text-emerald-500"
                          size={18}
                          aria-hidden="true"
                        />
                        <span className="text-left">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          }
        )}
      </div>
    </>
  );
};
