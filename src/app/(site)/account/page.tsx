import {
  CalendarDays,
  CheckCircle2,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  redirect,
} from "next/navigation";

import SignOutButton from "@/components/auth/SignOutButton";

import {
  createServerSupabaseClient,
} from "@/lib/supabase/server";

export const metadata = {
  title:
    "My Account | The Witness Path",

  description:
    "Manage your account on The Witness Path.",
};

export const dynamic =
  "force-dynamic";

function formatDate(
  value:
    | string
    | undefined
    | null
) {
  if (
    !value
  ) {
    return "Not available";
  }

  try {
    return new Intl.DateTimeFormat(
      "en",
      {
        day:
          "numeric",

        month:
          "long",

        year:
          "numeric",
      }
    ).format(
      new Date(
        value
      )
    );
  } catch {
    return "Not available";
  }
}

export default async function AccountPage() {
  const supabase =
    await createServerSupabaseClient();

  const {
    data: {
      user,
    },
    error,
  } =
    await supabase.auth
      .getUser();

  /*
   * No valid public-user session.
   */
  if (
    error ||
    !user
  ) {
    redirect(
      "/auth/login?next=/account"
    );
  }

  const verified =
    Boolean(
      user.email_confirmed_at
    );

  return (
    <main className="min-h-screen bg-[#FFFDF8] px-4 pb-20 pt-28 text-[#07162E] dark:bg-[#06111F] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1120px]">
        {/* HEADER */}

        <div className="max-w-2xl">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.23em] text-[#D97706] dark:text-[#F59E0B]">
            Your account
          </p>

          <h1 className="mt-3 font-serif text-4xl leading-[0.96] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
            Welcome to your
            <br />

            <span className="text-[#D97706] dark:text-[#F59E0B]">
              Witness Path.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400">
            This is your personal
            account space. As the
            community grows, your
            saved activity and
            account features can
            live here.
          </p>
        </div>

        {/* ACCOUNT GRID */}

        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_340px]">
          {/* DETAILS */}

          <section className="rounded-[24px] border border-[#07162E]/10 bg-white p-5 sm:p-7 dark:border-white/10 dark:bg-[#0B1A2A]">
            <div className="flex items-center gap-3 border-b border-[#07162E]/10 pb-5 dark:border-white/10">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-[#F59E0B]/10 text-[#D97706] dark:text-[#F59E0B]">
                <UserRound
                  size={18}
                />
              </div>

              <div>
                <h2 className="text-sm font-extrabold">
                  Account details
                </h2>

                <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                  Your current
                  authentication
                  information.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <AccountRow
                icon={
                  Mail
                }
                label="Email address"
                value={
                  user.email ||
                  "Not available"
                }
              />

              <AccountRow
                icon={
                  verified
                    ? CheckCircle2
                    : ShieldCheck
                }
                label="Email status"
                value={
                  verified
                    ? "Verified"
                    : "Awaiting verification"
                }
              />

              <AccountRow
                icon={
                  CalendarDays
                }
                label="Account created"
                value={
                  formatDate(
                    user.created_at
                  )
                }
              />
            </div>
          </section>

          {/* SECURITY */}

          <aside className="rounded-[24px] border border-[#07162E]/10 bg-white p-5 sm:p-6 dark:border-white/10 dark:bg-[#0B1A2A]">
            <div className="flex size-10 items-center justify-center rounded-xl border border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#D97706] dark:text-[#F59E0B]">
              <ShieldCheck
                size={17}
              />
            </div>

            <h2 className="mt-5 font-serif text-2xl tracking-[-0.035em]">
              Account security
            </h2>

            <p className="mt-3 text-xs leading-6 text-slate-500 dark:text-slate-400">
              Your account session
              is protected through
              Supabase authentication.
              Sign out when using a
              shared device.
            </p>

            <div className="mt-6">
              <SignOutButton />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/*
 * =================================
 * ACCOUNT DETAIL ROW
 * =================================
 */

function AccountRow({
  icon: Icon,
  label,
  value,
}: {
  icon:
    typeof Mail;

  label:
    string;

  value:
    string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#07162E]/8 bg-[#FFFDF8] p-4 dark:border-white/10 dark:bg-[#06111F]">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F59E0B]/10 text-[#D97706] dark:text-[#F59E0B]">
        <Icon
          size={14}
        />
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-slate-400 dark:text-slate-600">
          {label}
        </p>

        <p className="mt-1 break-words text-xs font-bold text-[#07162E] dark:text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
}