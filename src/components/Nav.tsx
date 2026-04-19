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
/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import companyInfo from "../../data/company-info.json";

const { name } = companyInfo;

type NavChild = Readonly<{ name: string; href: string }>;
type NavItem = Readonly<{
  name: string;
  href: string;
  children?: ReadonlyArray<NavChild>;
}>;

const navItems: ReadonlyArray<NavItem> = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "SIGINT", href: "/sigint" },
  {
    name: "Awareness",
    href: "/awareness",
    children: [
      { name: "Overview", href: "/awareness" },
      { name: "The Digital House", href: "/awareness/digital-house" },
      { name: "GRIDRUNNER", href: "/awareness/gridrunner" },
    ],
  },
  { name: "Contact", href: "/contact" },
];

function cleanPath(p: string): string {
  const noQ = p.split("#")[0].split("?")[0];
  const trimmed = noQ.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

function hrefMatches(target: string, current: string): boolean {
  const t = cleanPath(target);
  if (t === "/") return current === t;
  return current === t || current.startsWith(`${t}/`);
}

function hrefExact(target: string, current: string): boolean {
  return cleanPath(target) === current;
}

function isBranchActive(item: NavItem, current: string): boolean {
  if (hrefMatches(item.href, current)) return true;
  return item.children?.some((c) => hrefMatches(c.href, current)) ?? false;
}

function DesktopNavItem({
  item,
  current,
}: Readonly<{ item: NavItem; current: string }>) {
  const [open, setOpen] = useState(false);
  // After clicking a child link the route changes and the layout reflows
  // (game routes hide the Logo + footer, which is a big shift). The cursor
  // can end up "newly inside" the parent <li> after the reflow and
  // mouseenter would re-trigger the dropdown. This cooldown ref suppresses
  // mouseenter for ~700ms after a click so navigation + reflow can settle.
  const cooldownRef = useRef(false);
  const active = isBranchActive(item, current);
  const baseClass = active
    ? "text-blue-500 dark:text-sky-400 font-semibold underline underline-offset-4"
    : "hover:text-blue-500 dark:hover:text-sky-400 text-gray-800 dark:text-gray-200 hover:underline underline-offset-4 font-semibold";

  if (!item.children || item.children.length === 0) {
    return (
      <li>
        <Link
          href={item.href}
          title={`${item.name} - Defend I.T. Solutions`}
          className={baseClass}
        >
          {item.name}
        </Link>
      </li>
    );
  }

  const handleMouseEnter = () => {
    if (cooldownRef.current) return;
    setOpen(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLLIElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setOpen(false);
    }
  };

  const handleChildClick = () => {
    setOpen(false);
    cooldownRef.current = true;
    globalThis.setTimeout(() => {
      cooldownRef.current = false;
    }, 700);
  };

  return (
    <li
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setOpen(false)}
      onFocus={handleMouseEnter}
      onBlur={handleBlur}
    >
      <div className="inline-flex items-center gap-1">
        <Link
          href={item.href}
          title={`${item.name} - Defend I.T. Solutions`}
          className={baseClass}
          aria-haspopup="true"
          aria-expanded={open}
        >
          {item.name}
        </Link>
        <span
          aria-hidden
          className={`text-xs leading-none transition-transform duration-150 ${
            open ? "rotate-180" : ""
          } ${
            active
              ? "text-blue-500 dark:text-sky-400"
              : "text-gray-800 dark:text-gray-200"
          }`}
        >
          ▾
        </span>
      </div>
      <div
        className={`absolute left-0 top-full z-50 pt-3 transition-opacity duration-150 ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="min-w-48 rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <ul className="flex flex-col text-sm">
            {item.children.map((child) => {
              const childActive = hrefExact(child.href, current);
              return (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    title={`${child.name} - Defend I.T. Solutions`}
                    onClick={handleChildClick}
                    className={[
                      "block whitespace-nowrap rounded-md px-3 py-2 font-medium transition-colors",
                      childActive
                        ? "text-blue-500 dark:text-sky-400"
                        : "text-gray-800 hover:text-blue-500 dark:text-gray-200 dark:hover:text-sky-400",
                    ].join(" ")}
                  >
                    {child.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </li>
  );
}

function MobileNavItem({
  item,
  current,
}: Readonly<{ item: NavItem; current: string }>) {
  const [open, setOpen] = useState<boolean>(() =>
    item.children ? isBranchActive(item, current) : false,
  );

  if (!item.children || item.children.length === 0) {
    const active = hrefMatches(item.href, current);
    return (
      <li>
        <Link
          href={item.href}
          title={`${item.name} - Defend I.T. Solutions`}
          className={
            active
              ? "text-blue-500 dark:text-sky-400 font-semibold underline underline-offset-4"
              : "hover:text-blue-500 dark:hover:text-sky-400 text-gray-700 dark:text-gray-300 hover:underline underline-offset-4 font-semibold"
          }
        >
          {item.name}
        </Link>
      </li>
    );
  }

  const branchActive = isBranchActive(item, current);

  return (
    <li>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={[
          "flex w-full items-center justify-between gap-3 font-semibold",
          branchActive
            ? "text-blue-500 dark:text-sky-400"
            : "text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-sky-400",
        ].join(" ")}
      >
        <span className={branchActive ? "underline underline-offset-4" : ""}>
          {item.name}
        </span>
        <span
          aria-hidden
          className={`text-xs transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>
      {open && (
        <ul className="mt-4 ml-2 space-y-4 border-l border-gray-300 dark:border-gray-700 pl-4">
          {item.children.map((child) => {
            const childActive = hrefExact(child.href, current);
            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  title={`${child.name} - Defend I.T. Solutions`}
                  className={
                    childActive
                      ? "text-blue-500 dark:text-sky-400 font-semibold underline underline-offset-4"
                      : "hover:text-blue-500 dark:hover:text-sky-400 text-gray-700 dark:text-gray-300 hover:underline underline-offset-4 font-semibold"
                  }
                >
                  {child.name}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

function RenderNavItems({
  navItems,
  pathname,
  isMobile = false,
}: Readonly<{
  navItems: ReadonlyArray<NavItem>;
  pathname: string;
  isMobile?: boolean;
}>) {
  const current = cleanPath(pathname);
  return navItems.map((item) =>
    isMobile ? (
      <MobileNavItem key={item.href} item={item} current={current} />
    ) : (
      <DesktopNavItem key={item.href} item={item} current={current} />
    ),
  );
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
        className="rounded-md p-2 text-2xl text-black transition hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-sky-500"
        aria-controls="mobile-drawer"
      >
        &#9776;
      </button>

      <div
        onClick={toggleMenu}
        className={`fixed inset-0 transition-opacity duration-300 ${
          menuOpen ? "opacity-100 z-50" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          id="mobile-drawer"
          onClick={(e) => e.stopPropagation()}
          className={`absolute left-0 top-0 h-full w-[82vw] max-w-sm border-r border-slate-200/80 bg-white/95 shadow-xl backdrop-blur-md transition-transform duration-300 dark:border-slate-700/70 dark:bg-gray-900/95 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={toggleMenu}
            className="absolute top-4 right-4 text-3xl text-slate-700 hover:text-blue-500 dark:text-white dark:hover:text-blue-500"
          >
            &times;
          </button>

          <ul className="flex flex-col space-y-6 p-5 pt-16 text-base bg-white/96 dark:bg-gray-900/95">
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
    <nav className="flex w-full items-center justify-between px-4 py-2 sm:px-5 lg:sticky lg:top-0 lg:z-50 lg:border-b lg:border-gray-300 lg:p-4 lg:dark:border-gray-800">
      <Link
        href="/"
        title="Defend I.T. Solutions Home"
        className="max-w-[72vw] truncate text-sm font-semibold hover:text-blue-600 dark:hover:text-blue-400 sm:max-w-none sm:text-base"
      >
        {name}&trade;
      </Link>
      <DesktopBar pathname={pathname} />
      <MobileBar pathname={pathname} />
    </nav>
  );
}
