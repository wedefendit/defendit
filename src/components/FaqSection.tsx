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

export type FaqItem = {
  question: string;
  answer: string;
};

type FaqSectionProps = {
  items: FaqItem[];
  heading?: string;
  id?: string;
};

export function FaqSection({
  items,
  heading = "Frequently Asked Questions",
  id = "faq",
}: FaqSectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className="pt-6 sm:pt-8 border-t border-gray-200/60 dark:border-gray-700/60"
      aria-labelledby={id}
    >
      <h2 id={id} className="text-2xl font-semibold mb-4">
        {heading}
      </h2>
      <div className="mt-4 space-y-3">
        {items.map(({ question, answer }) => (
          <details
            key={question}
            className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white/72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.045),transparent_58%)] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-white/82 hover:shadow-[0_16px_32px_rgba(15,23,42,0.12)] dark:border-slate-700/70 dark:bg-slate-900/56 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_60%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.28)] dark:ring-white/5 dark:hover:border-sky-400/28 dark:hover:bg-slate-900/72 dark:hover:shadow-[0_22px_42px_rgba(2,6,23,0.34)]"
          >
            <summary className="cursor-pointer font-medium flex items-center justify-between text-gray-900 dark:text-white">
              <span className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 flex-shrink-0 text-blue-700 dark:text-sky-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {question}
              </span>
              <svg
                className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180 dark:text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <p className="mt-3 pl-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export default FaqSection;
