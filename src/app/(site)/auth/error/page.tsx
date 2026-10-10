import {
  CircleAlert,
  RefreshCw,
} from "lucide-react";

import Link from "next/link";

type Props = {
  searchParams: Promise<{
    reason?: string;
  }>;
};

export const metadata = {
  title:
    "Authentication Error | The Witness Path",
};

export default async function AuthErrorPage({
  searchParams,
}: Props) {
  const params =
    await searchParams;

  const confirmationError =
    params.reason ===
    "confirmation";

  return (
    <main className="flex min-h-screen items-center bg-[#FFFDF8] px-4 pb-16 pt-28 text-[#07162E] dark:bg-[#06111F] dark:text-white sm:px-6">
      <div className="mx-auto w-full max-w-[540px] rounded-[26px] border border-[#07162E]/10 bg-white p-7 shadow-[0_30px_90px_rgba(7,22,46,0.08)] sm:p-10 dark:border-white/10 dark:bg-[#0B1A2A] dark:shadow-none">
        <div className="flex size-11 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 text-red-500 dark:text-red-400">
          <CircleAlert
            size={19}
          />
        </div>

        <p className="mt-6 text-[9px] font-extrabold uppercase tracking-[0.23em] text-[#D97706] dark:text-[#F59E0B]">
          Authentication
        </p>

        <h1 className="mt-3 font-serif text-4xl leading-[0.96] tracking-[-0.05em] sm:text-5xl">
          We couldn&apos;t
          complete that.
        </h1>

        <p className="mt-5 text-sm leading-7 text-slate-500 dark:text-slate-400">
          {confirmationError
            ? "The confirmation link may have expired, already been used, or may no longer be valid."
            : "Something went wrong while completing the authentication request."}
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/auth/login"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#F59E0B] px-5 text-xs font-extrabold text-[#07162E] transition hover:bg-amber-400"
          >
            Return to sign in
          </Link>

          <Link
            href="/auth/register"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#07162E]/10 px-5 text-xs font-bold transition hover:border-[#F59E0B]/40 hover:text-[#D97706] dark:border-white/10 dark:hover:text-[#F59E0B]"
          >
            <RefreshCw
              size={13}
            />

            Create account again
          </Link>
        </div>
      </div>
    </main>
  );
}