"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ArrowUpRight,
  ChevronDown,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

/* =========================================================
   SOCIAL ICONS
========================================================= */

const FacebookIcon = ({
  size = 24,
}: {
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.4V13h2.8v8h3.3Z" />
  </svg>
);

const InstagramIcon = ({
  size = 24,
}: {
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="5"
    />

    <circle
      cx="12"
      cy="12"
      r="4"
    />

    <circle
      cx="17.5"
      cy="6.5"
      r="0.75"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

const YoutubeIcon = ({
  size = 24,
}: {
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2.5 7.5a2.5 2.5 0 0 1 2-2.4 48 48 0 0 1 15 0 2.5 2.5 0 0 1 2 2.4v9a2.5 2.5 0 0 1-2 2.4 48 48 0 0 1-15 0 2.5 2.5 0 0 1-2-2.4z" />

    <path d="m10 9 5 3-5 3z" />
  </svg>
);

/* =========================================================
   NAVIGATION DATA
========================================================= */

const testimonyLinks = [
  {
    label: "Read Testimonies",
    description:
      "Discover stories of God's faithfulness.",
    href: "/testimonies",
  },
  {
    label: "Share Testimony",
    description:
      "Tell what God has done in your life.",
    href: "/testimonies/share",
  },
];

const safeHavenLinks = [
  {
    label: "Share Struggles",
    description:
      "A safe space to open up and seek guidance.",
    href: "/guidance",
  },
  {
    label: "Pray for Me",
    description:
      "Share a prayer request with the community.",
    href: "/prayer",
  },
  {
    label: "Give Your Life to Christ",
    description:
      "Learn what it means to begin a life with Jesus.",
    href: "/salvation",
  },
];

const directNavLinks = [
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Vision & Mission",
    href: "/vision",
  },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/the_witnesspath",
    icon: InstagramIcon,
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

/* =========================================================
   COMPONENT
========================================================= */

export default function Navbar() {
  const pathname =
    usePathname();

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const [
    mobileTestimoniesOpen,
    setMobileTestimoniesOpen,
  ] = useState(false);

  const [
    mobileSafeHavenOpen,
    setMobileSafeHavenOpen,
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

  /* =======================================================
     THEME INITIALIZATION
  ======================================================= */

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
      savedTheme ===
        "dark" ||
      (!savedTheme &&
        systemDark)
        ? "dark"
        : "light";

    setTheme(
      initialTheme
    );

    document
      .documentElement
      .classList.toggle(
        "dark",
        initialTheme ===
          "dark"
      );

    setMounted(true);
  }, []);

  /* =======================================================
     SCROLL STATE
  ======================================================= */

  useEffect(() => {
    const handleScroll =
      () => {
        setScrolled(
          window.scrollY >
            12
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

  /* =======================================================
     MOBILE BODY LOCK
  ======================================================= */

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

  /* =======================================================
     CLOSE MOBILE MENU ON ROUTE CHANGE
  ======================================================= */

  useEffect(() => {
    setMobileOpen(false);
    setMobileTestimoniesOpen(
      false
    );
    setMobileSafeHavenOpen(
      false
    );
  }, [pathname]);

  /* =======================================================
     THEME TOGGLE
  ======================================================= */

  function toggleTheme() {
    const nextTheme:
      Theme =
      theme === "dark"
        ? "light"
        : "dark";

    setTheme(
      nextTheme
    );

    document
      .documentElement
      .classList.toggle(
        "dark",
        nextTheme ===
          "dark"
      );

    localStorage.setItem(
      "twp_theme",
      nextTheme
    );
  }

  /* =======================================================
     ACTIVE ROUTE HELPERS
  ======================================================= */

  function isActive(
    href: string
  ) {
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
  }

  const testimonyActive =
    testimonyLinks.some(
      (link) =>
        isActive(
          link.href
        )
    );

  const safeHavenActive =
    safeHavenLinks.some(
      (link) =>
        isActive(
          link.href
        )
    );

  /* =======================================================
     SOCIAL LINK HELPER
  ======================================================= */

  const SocialLinks = ({
    mobile = false,
  }: {
    mobile?: boolean;
  }) => (
    <>
      {socialLinks.map(
        ({
          label,
          href,
          icon: Icon,
        }) => (
          <a
            key={label}
            href={href}
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
            onClick={(
              event
            ) => {
              if (
                href === "#"
              ) {
                event.preventDefault();
              }
            }}
            aria-label={label}
            className={`flex items-center justify-center rounded-full transition duration-300 ${
              mobile
                ? "size-10 border border-[#07162E]/10 text-slate-500 hover:border-[#F59E0B] hover:text-[#D97706] dark:border-white/10 dark:text-slate-400 dark:hover:text-[#F59E0B]"
                : "size-8 text-slate-400 hover:bg-[#F59E0B]/10 hover:text-[#D97706] dark:text-slate-500 dark:hover:text-[#F59E0B]"
            }`}
          >
            <Icon
              size={
                mobile
                  ? 15
                  : 14
              }
            />
          </a>
        )
      )}
    </>
  );

  return (
    <>
      {/* ===================================================
          MAIN NAVBAR
      =================================================== */}

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-[#07162E]/10 bg-[#FFFDF8]/95 shadow-[0_12px_40px_rgba(7,22,46,0.07)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#06111F]/94 dark:shadow-[0_12px_40px_rgba(0,0,0,0.24)]"
            : "border-b border-transparent bg-[#FFFDF8]/88 backdrop-blur-lg dark:bg-[#06111F]/88"
        }`}
      >
        <div className="mx-auto grid h-[78px] w-full max-w-[1420px] grid-cols-[1fr_auto] items-center px-4 sm:px-6 xl:grid-cols-[1fr_auto_1fr] xl:px-8">
          {/* ===============================================
              LEFT
              LOGO + SOCIALS
          =============================================== */}

          <div className="flex items-center gap-3 justify-self-start">
            <Link
              href="/"
              aria-label="The Witness Path home"
              className="group flex shrink-0 items-center"
            >
              <Image
                src={
                  mounted &&
                  theme ===
                    "dark"
                    ? "/witness-icon.jpg"
                    : "/TheWitnessPathLogo2b.jpg"
                }
                alt="The Witness Path"
                width={175}
                height={48}
                priority
                className="h-[36px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.015] sm:h-[39px]"
              />
            </Link>

            {/* THEME TOGGLE */}

            <span className="mx-1 h-5 w-px bg-[#07162E]/10 dark:bg-white/10" />
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
              className="flex size-9 items-center justify-center rounded-full border border-[#07162E]/10 bg-white text-[#07162E] transition duration-300 hover:border-[#F59E0B]/60 hover:text-[#D97706] dark:border-white/10 dark:bg-[#0B1A2A] dark:text-slate-300 dark:hover:border-[#F59E0B]/60 dark:hover:text-[#F59E0B]"
            >
              {!mounted ? (
                <Sun
                  size={14}
                />
              ) : theme ===
                "dark" ? (
                <Moon
                  size={14}
                />
              ) : (
                <Sun
                  size={14}
                />
              )}
            </button>

            
          </div>

          {/* ===============================================
              CENTER NAVIGATION
          =============================================== */}

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-1 xl:flex"
          >
            {/* =============================================
                TESTIMONIES DROPDOWN
            ============================================= */}

            <div className="group relative">
              <button
                type="button"
                className={`relative flex items-center gap-1.5 px-3.5 py-3 text-[12px] font-bold transition-colors duration-300 ${
                  testimonyActive
                    ? "text-[#07162E] dark:text-white"
                    : "text-slate-500 hover:text-[#07162E] dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                Testimonies

                <ChevronDown
                  size={13}
                  className="transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180"
                />

                <span
                  className={`absolute bottom-[7px] left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-[#F59E0B] transition-all duration-300 ${
                    testimonyActive
                      ? "w-4 opacity-100"
                      : "w-0 opacity-0 group-hover:w-3 group-hover:opacity-100"
                  }`}
                />
              </button>

              {/* DROPDOWN */}

              <div className="invisible absolute left-1/2 top-[calc(100%-2px)] w-[310px] -translate-x-1/2 translate-y-2 opacity-0 transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="pt-3">
                  <div className="overflow-hidden rounded-[16px] border border-[#07162E]/10 bg-white p-2 shadow-[0_18px_55px_rgba(7,22,46,0.14)] dark:border-white/10 dark:bg-[#0B1A2A] dark:shadow-[0_20px_60px_rgba(0,0,0,0.32)]">
                    {testimonyLinks.map(
                      (
                        link
                      ) => (
                        <Link
                          key={
                            link.href
                          }
                          href={
                            link.href
                          }
                          className="group/item flex items-start justify-between gap-4 rounded-xl px-4 py-3.5 transition hover:bg-[#F59E0B]/[0.08] dark:hover:bg-white/[0.045]"
                        >
                          <div>
                            <span className="block text-[11px] font-extrabold text-[#07162E] transition group-hover/item:text-[#D97706] dark:text-white dark:group-hover/item:text-[#F59E0B]">
                              {
                                link.label
                              }
                            </span>

                            <span className="mt-1 block text-[10px] leading-5 text-slate-400 dark:text-slate-500">
                              {
                                link.description
                              }
                            </span>
                          </div>

                          <ArrowUpRight
                            size={
                              13
                            }
                            className="mt-0.5 shrink-0 text-slate-300 transition group-hover/item:-translate-y-0.5 group-hover/item:translate-x-0.5 group-hover/item:text-[#D97706] dark:text-slate-600 dark:group-hover/item:text-[#F59E0B]"
                          />
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* =============================================
                SAFE HAVEN DROPDOWN
            ============================================= */}

            <div className="group relative">
              <button
                type="button"
                className={`relative flex items-center gap-1.5 px-3.5 py-3 text-[12px] font-bold transition-colors duration-300 ${
                  safeHavenActive
                    ? "text-[#07162E] dark:text-white"
                    : "text-slate-500 hover:text-[#07162E] dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                Safe Haven

                <ChevronDown
                  size={13}
                  className="transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180"
                />

                <span
                  className={`absolute bottom-[7px] left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-[#F59E0B] transition-all duration-300 ${
                    safeHavenActive
                      ? "w-4 opacity-100"
                      : "w-0 opacity-0 group-hover:w-3 group-hover:opacity-100"
                  }`}
                />
              </button>

              {/* DROPDOWN */}

              <div className="invisible absolute left-1/2 top-[calc(100%-2px)] w-[330px] -translate-x-1/2 translate-y-2 opacity-0 transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="pt-3">
                  <div className="overflow-hidden rounded-[16px] border border-[#07162E]/10 bg-white p-2 shadow-[0_18px_55px_rgba(7,22,46,0.14)] dark:border-white/10 dark:bg-[#0B1A2A] dark:shadow-[0_20px_60px_rgba(0,0,0,0.32)]">
                    {safeHavenLinks.map(
                      (
                        link
                      ) => (
                        <Link
                          key={
                            link.href
                          }
                          href={
                            link.href
                          }
                          className="group/item flex items-start justify-between gap-4 rounded-xl px-4 py-3.5 transition hover:bg-[#F59E0B]/[0.08] dark:hover:bg-white/[0.045]"
                        >
                          <div>
                            <span className="block text-[11px] font-extrabold text-[#07162E] transition group-hover/item:text-[#D97706] dark:text-white dark:group-hover/item:text-[#F59E0B]">
                              {
                                link.label
                              }
                            </span>

                            <span className="mt-1 block text-[10px] leading-5 text-slate-400 dark:text-slate-500">
                              {
                                link.description
                              }
                            </span>
                          </div>

                          <ArrowUpRight
                            size={
                              13
                            }
                            className="mt-0.5 shrink-0 text-slate-300 transition group-hover/item:-translate-y-0.5 group-hover/item:translate-x-0.5 group-hover/item:text-[#D97706] dark:text-slate-600 dark:group-hover/item:text-[#F59E0B]"
                          />
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* =============================================
                DIRECT LINKS
            ============================================= */}

            {directNavLinks.map(
              (
                link
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
                    className={`group relative px-3.5 py-3 text-[12px] font-bold transition-colors duration-300 ${
                      active
                        ? "text-[#07162E] dark:text-white"
                        : "text-slate-500 hover:text-[#07162E] dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    {
                      link.label
                    }

                    <span
                      className={`absolute bottom-[7px] left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-[#F59E0B] transition-all duration-300 ${
                        active
                          ? "w-4 opacity-100"
                          : "w-0 opacity-0 group-hover:w-3 group-hover:opacity-100"
                      }`}
                    />
                  </Link>
                );
              }
            )}
          </nav>

          {/* ===============================================
              RIGHT
              SIGN IN + SUPPORT + THEME
          =============================================== */}

          <div className="hidden items-center gap-2.5 justify-self-end xl:flex">
            {/* SIGN IN */}

            <Link
              href="/auth/login"
              className={`rounded-xl px-3.5 py-2.5 text-[10px] font-bold transition ${
                isActive(
                  "/auth"
                )
                  ? "text-[#D97706] dark:text-[#F59E0B]"
                  : "text-slate-500 hover:text-[#07162E] dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Sign in
            </Link>

            {/* SUPPORT */}

            <Link
              href="/support"
              className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-4 text-[10px] font-extrabold text-[#07162E] shadow-[0_8px_20px_rgba(245,158,11,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-amber-400"
            >
              Support

              <ArrowUpRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            <span className="mx-0.5 h-5 w-px bg-[#07162E]/10 dark:bg-white/10" />

            {/* DESKTOP SOCIALS */}

              <div className="hidden items-center xl:flex">

              <div className="ml-1 flex items-center gap-0.5">
                <SocialLinks />
              </div>
            </div>
            
          </div>

          {/* ===============================================
              MOBILE CONTROLS
          =============================================== */}

          <div className="flex items-center gap-2 justify-self-end xl:hidden">
            {/* MOBILE THEME */}

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
              className="flex size-9 items-center justify-center rounded-full border border-[#07162E]/10 bg-white text-[#07162E] transition hover:border-[#F59E0B] dark:border-white/10 dark:bg-[#0B1A2A] dark:text-white"
            >
              {mounted &&
              theme ===
                "dark" ? (
                <Moon
                  size={14}
                />
              ) : (
                <Sun
                  size={14}
                />
              )}
            </button>

            {/* MENU */}

            <button
              type="button"
              onClick={() =>
                setMobileOpen(
                  (
                    current
                  ) =>
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
              className="flex size-9 items-center justify-center rounded-full border border-[#07162E]/10 bg-white text-[#07162E] transition hover:border-[#F59E0B] dark:border-white/10 dark:bg-[#0B1A2A] dark:text-white"
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

      {/* ===================================================
          MOBILE NAVIGATION
      =================================================== */}

      <div
        className={`fixed inset-0 z-40 xl:hidden ${
          mobileOpen
            ? "pointer-events-auto visible"
            : "pointer-events-none invisible"
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
          className={`absolute inset-0 bg-[#06111F]/45 backdrop-blur-[3px] transition-opacity duration-300 ${
            mobileOpen
              ? "opacity-100"
              : "opacity-0"
          }`}
        />

        {/* DRAWER */}

        <aside
          className={`absolute right-0 top-0 flex h-full w-[90%] max-w-[410px] flex-col overflow-y-auto border-l border-[#07162E]/10 bg-[#FFFDF8] px-5 pb-7 pt-[98px] shadow-[-25px_0_80px_rgba(7,22,46,0.18)] transition-transform duration-500 ease-out dark:border-white/10 dark:bg-[#06111F] ${
            mobileOpen
              ? "translate-x-0"
              : "translate-x-full"
          }`}
        >
          {/* INTRO */}

          <div className="mb-6">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#D97706] dark:text-[#F59E0B]">
              Explore the path
            </p>

            <h2 className="mt-2 font-serif text-3xl tracking-[-0.04em] text-[#07162E] dark:text-white">
              Witness His
              grace.
            </h2>
          </div>

          {/* ===============================================
              MOBILE TESTIMONIES
          =============================================== */}

          <div className="border-t border-[#07162E]/10 dark:border-white/10">
            <button
              type="button"
              onClick={() =>
                setMobileTestimoniesOpen(
                  (
                    current
                  ) =>
                    !current
                )
              }
              className="flex w-full items-center justify-between border-b border-[#07162E]/10 py-5 text-left dark:border-white/10"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`w-5 font-serif text-[11px] ${
                    testimonyActive
                      ? "text-[#D97706] dark:text-[#F59E0B]"
                      : "text-slate-400 dark:text-slate-600"
                  }`}
                >
                  01
                </span>

                <span className="font-serif text-[26px] tracking-[-0.035em] text-[#07162E] dark:text-white">
                  Testimonies
                </span>
              </div>

              <ChevronDown
                size={17}
                className={`text-slate-400 transition-transform duration-300 ${
                  mobileTestimoniesOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {mobileTestimoniesOpen && (
              <div className="border-b border-[#07162E]/10 bg-[#07162E]/[0.02] px-3 py-3 dark:border-white/10 dark:bg-white/[0.02]">
                {testimonyLinks.map(
                  (
                    link
                  ) => (
                    <Link
                      key={
                        link.href
                      }
                      href={
                        link.href
                      }
                      className="group flex items-center justify-between rounded-xl px-3 py-3.5 transition hover:bg-[#F59E0B]/10"
                    >
                      <div>
                        <p className="text-[11px] font-extrabold text-[#07162E] dark:text-white">
                          {
                            link.label
                          }
                        </p>

                        <p className="mt-1 text-[9px] leading-4 text-slate-400 dark:text-slate-500">
                          {
                            link.description
                          }
                        </p>
                      </div>

                      <ArrowUpRight
                        size={
                          14
                        }
                        className="shrink-0 text-[#D97706] dark:text-[#F59E0B]"
                      />
                    </Link>
                  )
                )}
              </div>
            )}
          </div>

          {/* ===============================================
              MOBILE SAFE HAVEN
          =============================================== */}

          <div>
            <button
              type="button"
              onClick={() =>
                setMobileSafeHavenOpen(
                  (
                    current
                  ) =>
                    !current
                )
              }
              className="flex w-full items-center justify-between border-b border-[#07162E]/10 py-5 text-left dark:border-white/10"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`w-5 font-serif text-[11px] ${
                    safeHavenActive
                      ? "text-[#D97706] dark:text-[#F59E0B]"
                      : "text-slate-400 dark:text-slate-600"
                  }`}
                >
                  02
                </span>

                <span className="font-serif text-[26px] tracking-[-0.035em] text-[#07162E] dark:text-white">
                  Safe Haven
                </span>
              </div>

              <ChevronDown
                size={17}
                className={`text-slate-400 transition-transform duration-300 ${
                  mobileSafeHavenOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {mobileSafeHavenOpen && (
              <div className="border-b border-[#07162E]/10 bg-[#07162E]/[0.02] px-3 py-3 dark:border-white/10 dark:bg-white/[0.02]">
                {safeHavenLinks.map(
                  (
                    link
                  ) => (
                    <Link
                      key={
                        link.href
                      }
                      href={
                        link.href
                      }
                      className="group flex items-center justify-between rounded-xl px-3 py-3.5 transition hover:bg-[#F59E0B]/10"
                    >
                      <div>
                        <p className="text-[11px] font-extrabold text-[#07162E] dark:text-white">
                          {
                            link.label
                          }
                        </p>

                        <p className="mt-1 max-w-[250px] text-[9px] leading-4 text-slate-400 dark:text-slate-500">
                          {
                            link.description
                          }
                        </p>
                      </div>

                      <ArrowUpRight
                        size={
                          14
                        }
                        className="shrink-0 text-[#D97706] dark:text-[#F59E0B]"
                      />
                    </Link>
                  )
                )}
              </div>
            )}
          </div>

          {/* ===============================================
              MOBILE DIRECT LINKS
          =============================================== */}

          <nav>
            {directNavLinks.map(
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
                    className="group flex items-center justify-between border-b border-[#07162E]/10 py-5 dark:border-white/10"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`w-5 font-serif text-[11px] ${
                          active
                            ? "text-[#D97706] dark:text-[#F59E0B]"
                            : "text-slate-400 dark:text-slate-600"
                        }`}
                      >
                        {String(
                          index +
                            3
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <span
                        className={`font-serif text-[26px] tracking-[-0.035em] ${
                          active
                            ? "text-[#07162E] dark:text-white"
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
                      className={`transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                        active
                          ? "text-[#D97706] dark:text-[#F59E0B]"
                          : "text-slate-300 dark:text-slate-700"
                      }`}
                    />
                  </Link>
                );
              }
            )}
          </nav>

          {/* ===============================================
              SOCIALS
          =============================================== */}

          <div className="mt-7">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-600">
              Follow the journey
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <SocialLinks
                mobile
              />

              <a
                href="https://instagram.com/the_witnesspath"
                target="_blank"
                rel="noreferrer"
                className="ml-1 text-[10px] font-semibold text-slate-400 transition hover:text-[#D97706] dark:text-slate-500 dark:hover:text-[#F59E0B]"
              >
                @the_witnesspath
              </a>
            </div>
          </div>

          {/* ===============================================
              BOTTOM ACTIONS
          =============================================== */}

          <div className="mt-auto grid gap-2 pt-8 sm:grid-cols-2">
            <Link
              href="/auth/login"
              className="flex min-h-[50px] items-center justify-center rounded-xl border border-[#07162E]/10 bg-white px-5 text-xs font-bold text-[#07162E] transition hover:border-[#F59E0B]/50 dark:border-white/10 dark:bg-[#0B1A2A] dark:text-white"
            >
              Sign in
            </Link>

            <Link
              href="/support"
              className="group flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-5 text-xs font-extrabold text-[#07162E] transition hover:bg-amber-400"
            >
              Support

              <ArrowUpRight
                size={13}
              />
            </Link>
          </div>

          <p className="mt-6 text-center text-[9px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-700">
            Witness His grace.
            Strengthen your
            faith.
          </p>
        </aside>
      </div>
    </>
  );
}