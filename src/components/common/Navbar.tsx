"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ArrowUpRight,
  Camera,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

const FacebookIcon = ({
  size = 24,
  strokeWidth = 2,
}: {
  size?: number;
  strokeWidth?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.4V13h2.8v8h3.3Z" stroke="currentColor" strokeWidth={strokeWidth} />
  </svg>
);

const YoutubeIcon = ({
  size = 24,
  strokeWidth = 2,
}: {
  size?: number;
  strokeWidth?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2.5 7.5a2.5 2.5 0 0 1 2-2.4 48 48 0 0 1 15 0 2.5 2.5 0 0 1 2 2.4v9a2.5 2.5 0 0 1-2 2.4 48 48 0 0 1-15 0 2.5 2.5 0 0 1-2-2.4z" />
    <path d="m10 9 5 3-5 3z" />
  </svg>
);

const navLinks = [
  {
    label: "Testimonies",
    href: "/testimonies",
  },
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Prayer",
    href: "/prayer",
  },
  {
    label: "About",
    href: "/about",
  },
];

/*
 * Replace these href values
 * with the real Witness Path
 * social links.
 */
const socialLinks = [
  {
    label: "Instagram",
    href: "#",
    icon: Camera,
  },
  {
    label: "Facebook",
    href: "#",
    icon: FacebookIcon,
  },
  {
    label: "YouTube",
    href: "#",
    icon: YoutubeIcon,
  },
];

type Theme =
  | "light"
  | "dark";

export default function Navbar() {
  const pathname =
    usePathname();

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const [
    scrolled,
    setScrolled,
  ] = useState(false);

  const [
    theme,
    setTheme,
  ] =
    useState<Theme>(
      "light"
    );

  const [
    mounted,
    setMounted,
  ] = useState(false);

  /*
   * THEME
   *
   * Preserves the old
   * twp_theme localStorage key.
   */
  useEffect(() => {
    const savedTheme =
      localStorage.getItem(
        "twp_theme"
      );

    const systemDark =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

    const initialTheme:
      Theme =
      savedTheme === "dark" ||
      (!savedTheme &&
        systemDark)
        ? "dark"
        : "light";

    setTheme(
      initialTheme
    );

    document.documentElement
      .classList.toggle(
        "dark",
        initialTheme ===
          "dark"
      );

    setMounted(true);
  }, []);

  /*
   * NAVBAR SCROLL STATE
   */
  useEffect(() => {
    const handleScroll =
      () => {
        setScrolled(
          window.scrollY >
            16
        );
      };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /*
   * LOCK BODY WHEN
   * MOBILE NAV IS OPEN
   */
  useEffect(() => {
    document.body.style.overflow =
      mobileOpen
        ? "hidden"
        : "";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [mobileOpen]);

  /*
   * CLOSE MOBILE NAV
   * WHEN ROUTE CHANGES
   */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggleTheme =
    () => {
      const nextTheme:
        Theme =
        theme === "dark"
          ? "light"
          : "dark";

      setTheme(
        nextTheme
      );

      document.documentElement
        .classList.toggle(
          "dark",
          nextTheme ===
            "dark"
        );

      localStorage.setItem(
        "twp_theme",
        nextTheme
      );
    };

  const isActive = (
    href: string
  ) => {
    if (
      href === "/"
    ) {
      return (
        pathname === "/"
      );
    }

    return pathname.startsWith(
      href
    );
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-slate-200/80 bg-white/90 shadow-[0_10px_35px_rgba(2,6,23,0.06)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#020617]/90"
            : "border-transparent bg-white/75 backdrop-blur-lg dark:bg-[#020617]/75"
        }`}
      >
        <div className="mx-auto flex h-[70px] w-full max-w-[1380px] items-center px-4 sm:px-6 lg:px-8">
          {/* =========================
              BRAND
          ========================= */}
          <Link
            href="/"
            aria-label="The Witness Path home"
            className="flex shrink-0 items-center"
          >
            <Image
              src={
                mounted &&
                theme ===
                  "dark"
                  ? "/TheWitnessPathLogo2.png"
                  : "/logo.png"
              }
              alt="The Witness Path"
              width={150}
              height={42}
              priority
              className="h-[34px] w-auto object-contain sm:h-[38px]"
            />
          </Link>

          {/* =========================
              DESKTOP NAV
          ========================= */}
          <nav
            aria-label="Primary navigation"
            className="mx-auto hidden items-center gap-1 lg:flex"
          >
            {navLinks.map(
              (link) => {
                const active =
                  isActive(
                    link.href
                  );

                return (
                  <Link
                    key={
                      link.href
                    }
                    href={
                      link.href
                    }
                    className={`relative rounded-full px-3.5 py-2 text-[12px] font-semibold transition ${
                      active
                        ? "bg-slate-100 text-[#020617] dark:bg-white/[0.08] dark:text-white"
                        : "text-slate-500 hover:bg-slate-100/80 hover:text-[#020617] dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
                    }`}
                  >
                    {
                      link.label
                    }

                    {active && (
                      <span className="absolute inset-x-0 -bottom-[15px] mx-auto h-[2px] w-4 rounded-full bg-[#F59E0B]" />
                    )}
                  </Link>
                );
              }
            )}
          </nav>

          {/* =========================
              DESKTOP RIGHT SIDE
          ========================= */}
          <div className="ml-auto hidden items-center gap-2 lg:flex">
            {/* SOCIALS */}
            <div className="flex items-center gap-0.5 border-r border-slate-200 pr-2 dark:border-white/10">
              {socialLinks.map(
                ({
                  label,
                  href,
                  icon: Icon,
                }) => (
                  <a
                    key={
                      label
                    }
                    href={
                      href
                    }
                    target={
                      href === "#"
                        ? undefined
                        : "_blank"
                    }
                    rel={
                      href === "#"
                        ? undefined
                        : "noreferrer"
                    }
                    aria-label={
                      label
                    }
                    className="flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-[#F59E0B] dark:text-slate-500 dark:hover:bg-white/[0.06] dark:hover:text-[#F59E0B]"
                  >
                    <Icon
                      size={
                        14
                      }
                      strokeWidth={
                        1.8
                      }
                    />
                  </a>
                )
              )}
            </div>

            {/* HANDLE */}
            <span className="hidden px-1 text-[9px] font-bold tracking-[0.05em] text-slate-400 xl:inline dark:text-slate-600">
              @the_witnesspath
            </span>

            {/* THEME */}
            <button
              type="button"
              onClick={
                toggleTheme
              }
              aria-label={
                theme ===
                "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              title={
                theme ===
                "dark"
                  ? "Light mode"
                  : "Dark mode"
              }
              className="relative flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[#F59E0B]/40 hover:text-[#F59E0B] dark:border-white/10 dark:bg-[#0E1628] dark:text-slate-300"
            >
              {!mounted ? (
                <Sun
                  size={15}
                />
              ) : theme ===
                "dark" ? (
                <Moon
                  size={15}
                />
              ) : (
                <Sun
                  size={15}
                />
              )}
            </button>

            {/* SIGN IN */}
            <Link
              href="/auth/login"
              className="px-2.5 py-2 text-[11px] font-semibold text-slate-500 transition hover:text-[#020617] dark:text-slate-400 dark:hover:text-white"
            >
              Sign in
            </Link>

            {/* PRIMARY CTA */}
            <Link
              href="/testimonies/share"
              className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#020617] px-4 text-[11px] font-bold text-white transition hover:bg-[#0E1628] dark:bg-[#F59E0B] dark:text-[#020617] dark:hover:bg-amber-400"
            >
              Share testimony

              <ArrowUpRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          {/* =========================
              MOBILE CONTROLS
          ========================= */}
          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={
                toggleTheme
              }
              aria-label={
                theme ===
                "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              className="flex size-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition dark:border-white/10 dark:text-slate-300"
            >
              {mounted &&
              theme ===
                "dark" ? (
                <Moon
                  size={15}
                />
              ) : (
                <Sun
                  size={15}
                />
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                setMobileOpen(
                  (current) =>
                    !current
                )
              }
              aria-label={
                mobileOpen
                  ? "Close navigation"
                  : "Open navigation"
              }
              aria-expanded={
                mobileOpen
              }
              className="flex size-9 items-center justify-center rounded-full border border-slate-200 text-[#020617] transition dark:border-white/10 dark:text-white"
            >
              {mobileOpen ? (
                <X
                  size={17}
                />
              ) : (
                <Menu
                  size={17}
                />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* =============================
          MOBILE NAVIGATION
      ============================= */}
      <div
        className={`fixed inset-0 z-40 transition duration-300 lg:hidden ${
          mobileOpen
            ? "visible"
            : "invisible pointer-events-none"
        }`}
      >
        {/* BACKDROP */}
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() =>
            setMobileOpen(
              false
            )
          }
          className={`absolute inset-0 bg-[#020617]/40 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen
              ? "opacity-100"
              : "opacity-0"
          }`}
        />

        {/* PANEL */}
        <aside
          className={`absolute right-0 top-0 flex h-full w-[88%] max-w-[390px] flex-col border-l border-slate-200 bg-white px-5 pb-7 pt-[92px] shadow-2xl transition-transform duration-300 dark:border-white/10 dark:bg-[#020617] ${
            mobileOpen
              ? "translate-x-0"
              : "translate-x-full"
          }`}
        >
          {/* NAV LINKS */}
          <nav className="border-t border-slate-200 dark:border-white/10">
            {navLinks.map(
              (
                link,
                index
              ) => {
                const active =
                  isActive(
                    link.href
                  );

                return (
                  <Link
                    key={
                      link.href
                    }
                    href={
                      link.href
                    }
                    className="group flex items-center justify-between border-b border-slate-200 py-5 dark:border-white/10"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`w-5 text-[10px] font-bold ${
                          active
                            ? "text-[#F59E0B]"
                            : "text-slate-400 dark:text-slate-600"
                        }`}
                      >
                        {String(
                          index +
                            1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <span
                        className={`text-xl font-bold tracking-[-0.03em] ${
                          active
                            ? "text-[#020617] dark:text-white"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {
                          link.label
                        }
                      </span>
                    </div>

                    <ArrowUpRight
                      size={16}
                      className={`transition ${
                        active
                          ? "text-[#F59E0B]"
                          : "text-slate-300 group-hover:text-[#F59E0B] dark:text-slate-700"
                      }`}
                    />
                  </Link>
                );
              }
            )}
          </nav>

          {/* SOCIALS */}
          <div className="mt-7">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-600">
              Follow the journey
            </p>

            <div className="mt-3 flex items-center gap-2">
              {socialLinks.map(
                ({
                  label,
                  href,
                  icon: Icon,
                }) => (
                  <a
                    key={
                      label
                    }
                    href={
                      href
                    }
                    target={
                      href === "#"
                        ? undefined
                        : "_blank"
                    }
                    rel={
                      href === "#"
                        ? undefined
                        : "noreferrer"
                    }
                    aria-label={
                      label
                    }
                    className="flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-[#F59E0B]/40 hover:text-[#F59E0B] dark:border-white/10 dark:text-slate-400"
                  >
                    <Icon
                      size={
                        15
                      }
                    />
                  </a>
                )
              )}

              <span className="ml-2 text-[10px] font-semibold text-slate-400 dark:text-slate-600">
                @the_witnesspath
              </span>
            </div>
          </div>

          {/* MOBILE BOTTOM ACTIONS */}
          <div className="mt-auto grid gap-2 pt-8">
            <Link
              href="/testimonies/share"
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#020617] px-5 text-xs font-bold text-white dark:bg-[#F59E0B] dark:text-[#020617]"
            >
              Share your testimony

              <ArrowUpRight
                size={13}
              />
            </Link>

            <Link
              href="/auth/login"
              className="flex min-h-[48px] items-center justify-center rounded-full border border-slate-200 px-5 text-xs font-bold text-[#020617] dark:border-white/10 dark:text-white"
            >
              Sign in
            </Link>
          </div>

          <p className="mt-6 text-center text-[9px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-700">
            Witness His grace.
            Strengthen your faith.
          </p>
        </aside>
      </div>
    </>
  );
}