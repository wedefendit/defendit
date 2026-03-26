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
/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import companyInfo from "../../data/company-info.json";

const { name } = companyInfo;

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "SIGINT", href: "/sigint" },
  { name: "Awareness", href: "/awareness" },
  { name: "Contact", href: "/contact" },
];

function RenderNavItems({
  navItems,
  pathname,
  isMobile = false,
}: Readonly<{
  navItems: { name: string; href: string }[];
  pathname: string;
  isMobile?: boolean;
}>) {
  const clean = (p: string) => {
    const noQ = p.split("#")[0].split("?")[0];
    const trimmed = noQ.replace(/\/+$/, "");
    return trimmed === "" ? "/" : trimmed;
  };

  const current = clean(pathname);

  return navItems.map(({ name, href }) => {
    const target = clean(href);
    const textColor = isMobile
      ? "text-gray-300"
      : "text-gray-800 dark:text-gray-200";

    const isActive =
      target === "/"
        ? current === target
        : current === target || current.startsWith(`${target}/`);

    return (
      <li key={`${name}-${target}`}>
        <Link
          href={href}
          title={`${name} - Defend I.T. Solutions`}
          className={
            isActive
              ? "text-blue-500 dark:text-sky-400 font-semibold underline underline-offset-4"
              : `hover:text-blue-500 dark:hover:text-sky-400 ${textColor} hover:underline underline-offset-4 font-semibold`
          }
        >
          {name}
        </Link>
      </li>
    );
  });
}

function DesktopBar({ pathname }: { pathname: string }) {
  return (
    <ul className="hidden lg:flex space-x-5 xl:space-x-10 text-base xl:text-lg w-auto m-0 lg:mr-8 xl:mr-16 md:mx-auto">
      <RenderNavItems navItems={navItems} pathname={pathname} />
    </ul>
  );
}

function MobileBar({ pathname }: { pathname: string }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleRouteChange = () => setMenuOpen(false);
    router.events.on("routeChangeStart", handleRouteChange);
    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [router.events]);

  useEffect(() => {
    if (!menuOpen) return;

    const scrollY = window.scrollY;
    const { style } = document.body;

    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.left = "0";
    style.right = "0";
    style.width = "100%";
    style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";

    return () => {
      const y = Math.abs(parseInt(style.top || "0", 10)) || 0;
      style.position = "";
      style.top = "";
      style.left = "";
      style.right = "";
      style.width = "";
      style.overflow = "";
      document.documentElement.style.overscrollBehavior = "";
      window.scrollTo(0, y);
    };
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen((v) => !v);

  return (
    <div className="lg:hidden relative">
      <button
        type="button"
        onClick={toggleMenu}
        className="text-black dark:text-gray-300 hover:text-blue-500 text-2xl"
        aria-controls="mobile-drawer"
      >
        &#9776;
      </button>

      <div
        onClick={toggleMenu}
        className={`fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300 ${
          menuOpen ? "opacity-100 z-50" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          id="mobile-drawer"
          onClick={(e) => e.stopPropagation()}
          className={`bg-gray-900/80 backdrop-blur-md w-2/3 max-w-xs h-full absolute left-0 top-0 transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={toggleMenu}
            className="absolute top-4 right-4 text-white text-3xl hover:text-blue-500"
          >
            &times;
          </button>

          <ul className="flex flex-col space-y-6 p-4">
            <RenderNavItems
              navItems={navItems}
              pathname={pathname}
              isMobile={true}
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const { pathname } = useRouter();

  return (
    <nav className="py-1 px-5 w-full lg:sticky lg:top-0 lg:z-50 flex justify-between items-center lg:border-b lg:border-gray-300 lg:dark:border-gray-800 lg:p-4">
      <Link
        href="/"
        title="Defend I.T. Solutions Home"
        className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold"
      >
        {name}&trade;
      </Link>
      <DesktopBar pathname={pathname} />
      <MobileBar pathname={pathname} />
    </nav>
  );
}
