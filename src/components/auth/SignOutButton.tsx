"use client";

import {
  LogOut,
  Loader2,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  useMemo,
  useState,
} from "react";

import {
  createBrowserSupabaseClient,
} from "@/lib/supabase/browser";

export default function SignOutButton() {
  const router =
    useRouter();

  const supabase =
    useMemo(
      () =>
        createBrowserSupabaseClient(),
      []
    );

  const [
    signingOut,
    setSigningOut,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const signOut =
    async () => {
      if (
        signingOut
      ) {
        return;
      }

      setSigningOut(
        true
      );

      setError(
        ""
      );

      try {
        const {
          error:
            signOutError,
        } =
          await supabase.auth
            .signOut();

        if (
          signOutError
        ) {
          setError(
            signOutError.message
          );

          return;
        }

        router.replace(
          "/auth/login"
        );

        router.refresh();
      } catch {
        setError(
          "Unable to sign out right now."
        );
      } finally {
        setSigningOut(
          false
        );
      }
    };

  return (
    <div>
      <button
        type="button"
        onClick={
          signOut
        }
        disabled={
          signingOut
        }
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-500/20 px-5 text-xs font-extrabold text-red-500 transition hover:bg-red-500/5 disabled:cursor-not-allowed disabled:opacity-40 dark:text-red-400"
      >
        {signingOut ? (
          <>
            <Loader2
              size={14}
              className="animate-spin"
            />

            Signing out...
          </>
        ) : (
          <>
            <LogOut
              size={14}
            />

            Sign out
          </>
        )}
      </button>

      {error && (
        <p
          role="alert"
          className="mt-3 text-xs text-red-500 dark:text-red-300"
        >
          {error}
        </p>
      )}
    </div>
  );
}