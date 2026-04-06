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
type RemoteServicesCTAProps = { isRemote?: boolean };
export default function RemoteServicesCTA(props: RemoteServicesCTAProps) {
  return (
    <>
      {props?.isRemote && (
        <section className="mt-8 flex h-auto w-full flex-col items-start justify-center rounded-md text-gray-200">
          <h3 className="text-gray-700 dark:text-gray-300 mb-4 text-left  text-base sm:text-2xl font-semibold">
            Need a Remote Service Plan?
          </h3>
          <span className="flex w-full flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white/74 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_58%)] p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md sm:p-12 dark:border-slate-700/70 dark:bg-slate-950/62 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.1),transparent_60%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5">
            <p className="my-2 sm:my-4 text-gray-50 dark:text-gray-200 text-lg text-center font-bold">
              We offer flexible remote support plans tailored to your needs.
            </p>
            <Link
              href="/services/remote/remote-support-plan"
              className="mt-2 whitespace-nowrap rounded-lg border border-sky-300/70 bg-sky-100 px-6 py-4 text-sm font-bold text-sky-800 shadow-[0_8px_18px_rgba(59,130,246,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-400/80 hover:bg-sky-50 hover:shadow-[0_14px_28px_rgba(59,130,246,0.18)] sm:text-md dark:border-sky-400/20 dark:bg-slate-900/80 dark:text-sky-300 dark:shadow-[0_14px_28px_rgba(2,132,199,0.16)] dark:hover:border-sky-400/32 dark:hover:bg-slate-900 dark:hover:text-sky-200"
            >
              Remote Support Plans →
            </Link>
          </span>
        </section>
      )}
      <section
        className={`${
          props.isRemote ? "mt-16" : "mt-8"
        } w-full h-auto flex flex-col items-start justify-center  text-gray-200 rounded-md`}
      >
        <h3 className=" text-gray-700 dark:text-gray-300 mb-4 text-left text-2xl font-semibold">
          {props?.isRemote
            ? "Looking for More Personable Support?"
            : "Looking for Remote Service Options?"}
        </h3>

        <span className="flex w-full flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white/72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_58%)] p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md sm:p-6 dark:border-slate-700/70 dark:bg-slate-950/58 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.09),transparent_60%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5">
          <p className="my-2 sm:my-4 text-black dark:text-gray-200 text-lg text-center">
            {props?.isRemote
              ? "We offer a range of on-site services."
              : "Explore our remote support options for fast, secure, and personal assistance."}
          </p>
          <Link
            href={props?.isRemote ? "/services" : "/services/remote"}
            className="whitespace-nowrap rounded-lg border border-slate-300 bg-white/80 px-6 py-4 text-sm text-slate-800 shadow-[0_8px_18px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-white hover:text-sky-800 hover:shadow-[0_14px_28px_rgba(15,23,42,0.12)] sm:text-md dark:border-slate-600 dark:bg-slate-950/78 dark:text-slate-200 dark:shadow-[0_14px_28px_rgba(2,6,23,0.22)] dark:hover:border-sky-400/28 dark:hover:bg-slate-900 dark:hover:text-sky-200"
          >
            {props?.isRemote ? "On-Site Services →" : "Remote Support →"}
          </Link>
        </span>
      </section>
    </>
  );
}

export { RemoteServicesCTA };
