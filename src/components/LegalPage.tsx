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

export function LegalPage({ children }: { children: React.ReactNode }) {
  return (
    <main
      className={`font-sans relative min-h-full flex flex-col items-center justify-start w-full`}
    >
      <section className="max-w-5xl mx-auto px-6 py-12 bg-white/20 dark:bg-slate-900/55  text-gray-900 dark:text-gray-100 font-serif text-justify leading-relaxed">
        {children}

        <footer className="pt-8 border-t mt-8 text-sm text-center text-gray-500">
          Prepared by: &copy; 2002-2026 LawDepot.com&reg;
        </footer>
      </section>
    </main>
  );
}
