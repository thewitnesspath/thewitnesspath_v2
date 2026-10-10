"use client";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
} from "lucide-react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  createBrowserSupabaseClient,
} from "@/lib/supabase/browser";

type Props = {
  nextPath?: string;
};

function getSafeNextPath(
  value?: string
) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {
    return "/account";
  }

  return value;
}

export default function LoginForm({
  nextPath,
}: Props) {
  const router =
    useRouter();

  const supabase =
    useMemo(
      () =>
        createBrowserSupabaseClient(),
      []
    );

  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false);

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const submit =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      const cleanEmail =
        email
          .trim()
          .toLowerCase();

      if (
        !cleanEmail ||
        !password
      ) {
        setError(
          "Enter your email and password."
        );

        return;
      }

      setSubmitting(
        true
      );

      setError(
        ""
      );

      try {
        const {
          error:
            signInError,
        } =
          await supabase.auth
            .signInWithPassword({
              email:
                cleanEmail,

              password,
            });

        if (
          signInError
        ) {
          if (
            signInError.message
              .toLowerCase()
              .includes(
                "invalid login credentials"
              )
          ) {
            setError(
              "The email or password is incorrect."
            );
          } else if (
            signInError.message
              .toLowerCase()
              .includes(
                "email not confirmed"
              )
          ) {
            setError(
              "Please confirm your email before signing in."
            );
          } else {
            setError(
              signInError.message
            );
          }

          return;
        }

        router.replace(
          getSafeNextPath(
            nextPath
          )
        );

        router.refresh();
      } catch {
        setError(
          "Unable to sign in right now. Please try again."
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };

  const disabled =
    submitting ||
    !email.trim() ||
    !password;

  return (
    <form
      onSubmit={
        submit
      }
      className="w-full"
    >
      <div className="mb-8">
        <div className="flex size-11 items-center justify-center rounded-2xl border border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#D97706] dark:text-[#F59E0B]">
          <LockKeyhole
            size={
              18
            }
          />
        </div>

        <p className="mt-6 text-[9px] font-extrabold uppercase tracking-[0.23em] text-[#D97706] dark:text-[#F59E0B]">
          Welcome back
        </p>

        <h1 className="mt-3 font-serif text-4xl leading-[0.96] tracking-[-0.05em] text-[#07162E] sm:text-5xl dark:text-white">
          Sign in to
          <br />
          continue.
        </h1>

        <p className="mt-4 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
          Access your Witness Path
          account and continue your
          journey across the platform.
        </p>
      </div>

      <div>
        <label
          htmlFor="login-email"
          className="mb-2 block text-xs font-bold text-[#07162E] dark:text-slate-300"
        >
          Email address
        </label>

        <input
          id="login-email"
          type="email"
          value={
            email
          }
          onChange={(
            event
          ) => {
            setEmail(
              event.target
                .value
            );

            if (
              error
            ) {
              setError(
                ""
              );
            }
          }}
          autoComplete="email"
          placeholder="you@example.com"
          disabled={
            submitting
          }
          className="h-12 w-full rounded-xl border border-[#07162E]/10 bg-white px-4 text-sm text-[#07162E] outline-none transition placeholder:text-slate-400 focus:border-[#F59E0B]/60 focus:ring-4 focus:ring-[#F59E0B]/10 disabled:opacity-60 dark:border-white/10 dark:bg-[#06111F] dark:text-white dark:placeholder:text-slate-600"
        />
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between gap-4">
          <label
            htmlFor="login-password"
            className="text-xs font-bold text-[#07162E] dark:text-slate-300"
          >
            Password
          </label>

          <Link
            href="/auth/forgot-password"
            className="text-[10px] font-bold text-[#D97706] transition hover:text-[#F59E0B] dark:text-[#F59E0B]"
          >
            Forgot password?
          </Link>
        </div>

        <div className="relative">
          <input
            id="login-password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={
              password
            }
            onChange={(
              event
            ) => {
              setPassword(
                event.target
                  .value
              );

              if (
                error
              ) {
                setError(
                  ""
                );
              }
            }}
            autoComplete="current-password"
            placeholder="Enter your password"
            disabled={
              submitting
            }
            className="h-12 w-full rounded-xl border border-[#07162E]/10 bg-white px-4 pr-12 text-sm text-[#07162E] outline-none transition placeholder:text-slate-400 focus:border-[#F59E0B]/60 focus:ring-4 focus:ring-[#F59E0B]/10 disabled:opacity-60 dark:border-white/10 dark:bg-[#06111F] dark:text-white dark:placeholder:text-slate-600"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (
                  current
                ) =>
                  !current
              )
            }
            disabled={
              submitting
            }
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
            className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-[#07162E]/5 hover:text-[#07162E] disabled:opacity-40 dark:text-slate-600 dark:hover:bg-white/5 dark:hover:text-white"
          >
            {showPassword ? (
              <EyeOff
                size={
                  15
                }
              />
            ) : (
              <Eye
                size={
                  15
                }
              />
            )}
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3"
        >
          <p className="text-xs leading-5 text-red-500 dark:text-red-300">
            {
              error
            }
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={
          disabled
        }
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-5 text-xs font-extrabold text-[#07162E] transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting ? (
          <>
            <Loader2
              size={
                14
              }
              className="animate-spin"
            />

            Signing in...
          </>
        ) : (
          <>
            Sign in

            <ArrowRight
              size={
                14
              }
            />
          </>
        )}
      </button>

      <p className="mt-6 text-center text-xs leading-6 text-slate-500 dark:text-slate-500">
        Don&apos;t have an account?{" "}

        <Link
          href="/auth/register"
          className="font-extrabold text-[#D97706] transition hover:text-[#F59E0B] dark:text-[#F59E0B]"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}