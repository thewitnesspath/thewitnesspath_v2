"use client";

import {
  BookOpen,
  BookMarked,
  CheckCircle2,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  ShieldCheck,
  Target,
  Shield,
  X,
} from "lucide-react";

import AdminOverview from "@/components/admin/AdminOverview";
import TestimonyWorkspace from "@/components/admin/TestimonyWorkspace";
import ModerationWorkspace from "@/components/admin/ModerationWorkspace";
import SafeHavenWorkspace from "@/components/admin/SafeHavenWorkspace";
import BlogWorkspace from "@/components/admin/BlogWorkspace";
import PrayerWorkspace from "@/components/admin/PrayerWorkspace";
import WatchmenWorkspace from "@/components/admin/WatchmenWorkspace";
import WordOfWeekWorkspace from "@/components/admin/WordOfWeekWorkspace";
import VisionMissionWorkspace from "@/components/admin/VisionMissionWorkspace";

import {
  useRouter,
} from "next/navigation";

import {
  useMemo,
  useState,
} from "react";

import {
  canAccessAdminSection,
  getAdminRoleLabel,
  type AdminRole,
  type AdminSection,
} from "@/lib/admin/roles";

type Props = {
  role: AdminRole;
};

const navigation: Array<{
  id: AdminSection;
  label: string;
  description: string;
  icon: typeof LayoutDashboard;
}> = [
  {
    id: "overview",
    label: "Overview",
    description:
      "Platform snapshot",
    icon: LayoutDashboard,
  },
  {
    id: "testimonies",
    label: "Testimonies",
    description:
      "Stories & moderation",
    icon: MessageSquareQuote,
  },
  {
    id: "blog",
    label: "Blog",
    description:
      "Teachings & articles",
    icon: BookOpen,
  },
  {
    id: "guidance",
    label: "Safe Haven",
    description:
      "Questions & guidance",
    icon: HeartHandshake,
  },
  {
  id: "watchmen",
  label: "Watchmen",
  description:
    "Prayer assignments",
  icon: Shield,
},
  {
    id: "prayer",
    label: "Prayer",
    description:
      "Prayer requests",
    icon: ShieldCheck,
  },
  {
    id: "word",
    label: "Word of the Week",
    description:
      "Weekly spiritual anchor",
    icon: BookMarked,
  },
  {
    id: "vision",
    label: "Vision & Mission",
    description:
      "Platform direction",
    icon: Target,
  },
  {
    id: "moderation",
    label: "Moderation",
    description:
      "Pending submissions",
    icon: CheckCircle2,
  },
];

function SectionShell({
  section,
}: {
  section: AdminSection;
}) {
  const item =
    navigation.find(
      (entry) =>
        entry.id ===
        section
    );

  if (!item) {
    return null;
  }

  const Icon = item.icon;

  return (
    <div>
      <div className="flex items-start gap-4 border-b border-white/10 pb-6">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
          <Icon size={18} />
        </div>

        <div>
          <h1 className="text-xl font-extrabold tracking-[-0.025em] text-white sm:text-2xl">
            {item.label}
          </h1>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {
              item.description
            }
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-secondary p-6">
        <p className="text-sm font-semibold text-slate-300">
          {item.label} workspace
        </p>

        <p className="mt-2 max-w-xl text-xs leading-6 text-slate-500">
          This section is ready for
          its existing Witness Path
          data and actions to be
          migrated into the new
          interface.
        </p>
      </div>
    </div>
  );
}

export default function AdminShell({
  role,
}: Props) {
  const router =
    useRouter();

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

    const [
    activeSection,
    setActiveSection,
    ] =
    useState<AdminSection>(
        role === "watchmen"
        ? "watchmen"
        : "overview"
    );

  const allowedNavigation =
    useMemo(
      () =>
        navigation.filter(
          (item) =>
            canAccessAdminSection(
              role,
              item.id
            )
        ),
      [role]
    );

  const openSection = (
    section: AdminSection
  ) => {
    if (
      !canAccessAdminSection(
        role,
        section
      )
    ) {
      return;
    }

    setActiveSection(
      section
    );

    setMobileOpen(false);
  };

  const logout =
    async () => {
      await fetch(
        "/api/admin/logout",
        {
          method: "POST",
        }
      );

      router.replace(
        "/admin/login"
      );

      router.refresh();
    };

  const sidebar = (
    <div className="flex h-full flex-col">
      {/* BRAND */}
      <div className="flex h-[72px] items-center border-b border-white/10 px-5">
        <img
          src="/logo.png"
          alt="The Witness Path"
          className="h-8 w-auto object-contain"
        />
      </div>

      {/* ROLE */}
      <div className="px-4 py-5">
        <div className="rounded-xl border border-white/10 bg-primary p-3">
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
            Signed in as
          </span>

          <div className="mt-2 flex items-center gap-2">
            <span className="size-2 rounded-full bg-accent" />

            <span className="text-xs font-bold text-white">
              {getAdminRoleLabel(
                role
              )}
            </span>
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {allowedNavigation.map(
          (item) => {
            const Icon =
              item.icon;

            const active =
              activeSection ===
              item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  openSection(
                    item.id
                  )
                }
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                  active
                    ? "bg-accent text-primary"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon
                  size={16}
                  strokeWidth={
                    active
                      ? 2.4
                      : 2
                  }
                />

                <span className="text-xs font-bold">
                  {
                    item.label
                  }
                </span>
              </button>
            );
          }
        )}
      </nav>

      {/* LOGOUT */}
      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={16} />
          Lock dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-primary text-white">
      {/* DESKTOP SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[230px] border-r border-white/10 bg-secondary lg:block">
        {sidebar}
      </aside>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() =>
              setMobileOpen(
                false
              )
            }
          />

          <aside className="relative h-full w-[82%] max-w-[285px] border-r border-white/10 bg-secondary shadow-2xl">
            <button
              type="button"
              onClick={() =>
                setMobileOpen(
                  false
                )
              }
              className="absolute right-3 top-5 z-10 flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-white"
            >
              <X size={17} />
            </button>

            {sidebar}
          </aside>
        </div>
      )}

      {/* MAIN */}
      <div className="lg:pl-[230px]">
        {/* TOPBAR */}
        <header className="sticky top-0 z-30 flex h-[64px] items-center justify-between border-b border-white/10 bg-primary/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setMobileOpen(
                  true
                )
              }
              className="flex size-9 items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:text-white lg:hidden"
            >
              <Menu size={17} />
            </button>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                Admin portal
              </p>

              <p className="mt-0.5 text-xs font-extrabold text-white">
                {
                  navigation.find(
                    (item) =>
                      item.id ===
                      activeSection
                  )?.label
                }
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="size-1.5 rounded-full bg-accent" />

            <span className="text-[10px] font-bold text-slate-500">
              {
                getAdminRoleLabel(
                  role
                )
              }
            </span>
          </div>
        </header>

        {/* WORKSPACE */}
        <main className="mx-auto w-full max-w-[1250px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          {activeSection ===
            "overview" ? (
            <AdminOverview
                role={role}
                onOpen={
                openSection
                }
            />
            ) : activeSection ===
            "testimonies" ? (
            <TestimonyWorkspace />
            ) : activeSection ===
            "moderation" ? (
            <ModerationWorkspace />
            ) : activeSection ===
            "guidance" ? (
            <SafeHavenWorkspace
                role={role}
            />
            ) : activeSection ===
            "blog" ? (
            <BlogWorkspace
                role={role}
            />
            ) : activeSection ===
            "prayer" ? (
            <PrayerWorkspace />
            ) : activeSection ===
            "watchmen" ? (
            <WatchmenWorkspace
                role={role}
            />
            ) : activeSection ===
            "word" ? (
            <WordOfWeekWorkspace
                role={role}
            />
            ) : activeSection ===
            "vision" ? (
            <VisionMissionWorkspace />
            ) : (
            <SectionShell
                section={
                activeSection
                }
            />
            )}
        </main>
      </div>
    </div>
  );
}