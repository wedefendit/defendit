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
import data from "../../data/safety-tips.json";

const top5 = data.top5 || [];

interface SafetyTip {
  icon: string;
  title: string;
  description: string;
}
export const SafetyTipsList: React.FC = () => {
  return (
    <>
      <header className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-slate-800 dark:text-slate-200">
          Start with the basics
        </h2>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          These are the habits and warning signs we talk through most often
          with local clients and community groups.
        </p>
      </header>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2">
        {(top5 as SafetyTip[]).map(({ icon, title, description }, index) => {
          // eslint-disable-next-line
          const IconComponent = (Icons as any)[icon] || Icons.Shield;
          return (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl border border-emerald-300/70 bg-white/78 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.05),transparent_54%)] p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] ring-1 ring-white/75 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/80 hover:bg-white/86 hover:shadow-[0_14px_30px_rgba(15,23,42,0.1)] dark:border-emerald-400/16 dark:bg-slate-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_60%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5 dark:hover:border-emerald-400/28 dark:hover:bg-slate-900/74 dark:hover:shadow-[0_24px_46px_rgba(2,6,23,0.36)]"
            >
              <div className="flex flex-col items-center mb-4">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-300/80 bg-emerald-100/92 shadow-[0_8px_18px_rgba(16,185,129,0.1)] dark:border-emerald-400/16 dark:bg-slate-800/88 dark:shadow-[0_10px_22px_rgba(16,185,129,0.14)]">
                  <IconComponent className="w-8 h-8 text-emerald-800 dark:text-emerald-300" />
                </div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 text-center">
                  {title}
                </h2>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm text-center leading-relaxed">
                {description}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
};
