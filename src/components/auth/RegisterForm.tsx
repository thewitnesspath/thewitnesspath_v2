"use client";

import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
} from "lucide-react";

import Link from "next/link";

import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  createBrowserSupabaseClient,
} from "@/lib/supabase/browser";

export default function RegisterForm() {
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
    confirmPassword,
    setConfirmPassword,
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

  const [
    success,
    setSuccess,
  ] =
    useState(false);

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
        !password ||
        !confirmPassword
      ) {
        setError(
          "Complete all fields."
        );

        return;
      }

      if (
        password.length <
        8
      ) {
        setError(
          "Your password must be at least 8 characters."
        );

        return;
      }

      if (
        password !==
        confirmPassword
      ) {
        setError(
          "The passwords do not match."
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
            signUpError,
        } =
          await supabase.auth
            .signUp({
              email:
                cleanEmail,

              password,

              options: {
                emailRedirectTo:
                  `${window.location.origin}/auth/confirm?next=/account`,
              },
            });

        if (
          signUpError
        ) {
          setError(
            signUpError.message
          );

          return;
        }

        setSuccess(
          true
        );
      } catch {
        setError(
          "Unable to create your account right now. Please try again."
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };

  if (
    success
  ) {
    return (
      <div className="w-full">
        <div className="flex size-12 items-center justify-center rounded-2xl border border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#D97706] dark:text-[#F59E0B]">
          <Check
            size={
              20
            }
          />
        </div>

        <p className="mt-6 text-[9px] font-extrabold uppercase tracking-[0.23em] text-[#D97706] dark:text-[#F59E0B]">
          Almost there
        </p>

        <h1 className="mt-3 font-serif text-4xl leading-[0.96] tracking-[-0.05em] text-[#07162E] sm:text-5xl dark:text-white">
          Check your
          <br />
          email.
        </h1>

        <p className="mt-5 text-sm leading-7 text-slate-500 dark:text-slate-400">
          We sent a confirmation
          link to{" "}

          <span className="font-bold text-[#07162E] dark:text-white">
            {
              email
            }
          </span>
          . Open it to activate your
          Witness Path account.
        </p>

        <Link
          href="/auth/login"
          className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#07162E]/10 px-5 text-xs font-extrabold text-[#07162E] transition hover:border-[#F59E0B]/40 hover:text-[#D97706] dark:border-white/10 dark:text-white dark:hover:text-[#F59E0B]"
        >
          Return to sign in

          <ArrowRight
            size={
              13
            }
          />
        </Link>
      </div>
    );
  }

  const disabled =
    submitting ||
    !email.trim() ||
    !password ||
    !confirmPassword;

  return (
    <form
      onSubmit={
        submit
      }
      className="w-full"
    >
      <div className="mb-8">
        <div className="flex size-11 items-center justify-center rounded-2xl border border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#D97706] dark:text-[#F59E0B]">
          <UserPlus
            size={
              18
            }
          />
        </div>

        <p className="mt-6 text-[9px] font-extrabold uppercase tracking-[0.23em] text-[#D97706] dark:text-[#F59E0B]">
          Join the path
        </p>

        <h1 className="mt-3 font-serif text-4xl leading-[0.96] tracking-[-0.05em] text-[#07162E] sm:text-5xl dark:text-white">
          Create your
          <br />
          account.
        </h1>

        <p className="mt-4 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
          Create an account to
          access the growing Witness
          Path community.
        </p>
      </div>

      <div>
        <label
          htmlFor="register-email"
          className="mb-2 block text-xs font-bold text-[#07162E] dark:text-slate-300"
        >
          Email address
        </label>

        <input
          id="register-email"
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
        <label
          htmlFor="register-password"
          className="mb-2 block text-xs font-bold text-[#07162E] dark:text-slate-300"
        >
          Password
        </label>

        <div className="relative">
          <input
            id="register-password"
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
            autoComplete="new-password"
            placeholder="Minimum 8 characters"
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
            className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-[#07162E]/5 hover:text-[#07162E] dark:text-slate-600 dark:hover:bg-white/5 dark:hover:text-white"
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

      <div className="mt-5">
        <label
          htmlFor="confirm-password"
          className="mb-2 block text-xs font-bold text-[#07162E] dark:text-slate-300"
        >
          Confirm password
        </label>

        <input
          id="confirm-password"
          type={
            showPassword
              ? "text"
              : "password"
          }
          value={
            confirmPassword
          }
          onChange={(
            event
          ) => {
            setConfirmPassword(
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
          autoComplete="new-password"
          placeholder="Enter the password again"
          disabled={
            submitting
          }
          className="h-12 w-full rounded-xl border border-[#07162E]/10 bg-white px-4 text-sm text-[#07162E] outline-none transition placeholder:text-slate-400 focus:border-[#F59E0B]/60 focus:ring-4 focus:ring-[#F59E0B]/10 disabled:opacity-60 dark:border-white/10 dark:bg-[#06111F] dark:text-white dark:placeholder:text-slate-600"
        />
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

            Creating account...
          </>
        ) : (
          <>
            Create account

            <ArrowRight
              size={
                14
              }
            />
          </>
        )}
      </button>

      <p className="mt-6 text-center text-xs leading-6 text-slate-500">
        Already have an account?{" "}

        <Link
          href="/auth/login"
          className="font-extrabold text-[#D97706] transition hover:text-[#F59E0B] dark:text-[#F59E0B]"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}