"use client";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  useState,
  type FormEvent,
} from "react";

type LoginMode =
  | "admin"
  | "watchmen";

export default function AdminLoginForm() {
  const router =
    useRouter();

  const [
    mode,
    setMode,
  ] =
    useState<LoginMode>(
      "admin"
    );

  const [
    pin,
    setPin,
  ] =
    useState("");

  const [
    showPin,
    setShowPin,
  ] =
    useState(false);

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    message,
    setMessage,
  ] =
    useState("");

  /*
   * ================================
   * CHANGE LOGIN MODE
   * ================================
   */
  const changeMode = (
    nextMode: LoginMode
  ) => {
    if (
      submitting
    ) {
      return;
    }

    setMode(
      nextMode
    );

    setPin(
      ""
    );

    setShowPin(
      false
    );

    setMessage(
      ""
    );
  };

  /*
   * ================================
   * LOGIN
   * ================================
   */
  const submit =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      const cleanPin =
        pin.trim();

      if (
        !cleanPin
      ) {
        return;
      }

      setSubmitting(
        true
      );

      setMessage(
        ""
      );

      try {
        const response =
          await fetch(
            "/api/admin/verify-pin",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  pin:
                    cleanPin,

                  mode,
                }),
            }
          );

        const result =
          await response.json();

        if (
          !response.ok
        ) {
          setMessage(
            result.message ||
              "Unable to sign in."
          );

          return;
        }

        /*
         * The server creates the
         * secure HTTP-only admin
         * session cookie.
         */
        router.replace(
          "/admin"
        );

        router.refresh();
      } catch {
        setMessage(
          "Unable to connect. Try again."
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };

  return (
    <form
      onSubmit={
        submit
      }
      className="w-full"
    >
      {/* =============================
          ACCESS TYPE
      ============================= */}

      <div className="mb-7 grid grid-cols-2 rounded-xl border border-white/10 bg-primary p-1">
        <button
          type="button"
          onClick={() =>
            changeMode(
              "admin"
            )
          }
          disabled={
            submitting
          }
          aria-pressed={
            mode ===
            "admin"
          }
          className={`min-h-9 rounded-lg text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
            mode ===
            "admin"
              ? "bg-secondary text-white shadow-sm"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          Admin
        </button>

        <button
          type="button"
          onClick={() =>
            changeMode(
              "watchmen"
            )
          }
          disabled={
            submitting
          }
          aria-pressed={
            mode ===
            "watchmen"
          }
          className={`min-h-9 rounded-lg text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
            mode ===
            "watchmen"
              ? "bg-secondary text-white shadow-sm"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          Watchmen
        </button>
      </div>

      {/* =============================
          INTRODUCTION
      ============================= */}

      <div className="mb-7">
        <div className="flex size-10 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
          {mode ===
          "watchmen" ? (
            <ShieldCheck
              size={
                18
              }
            />
          ) : (
            <LockKeyhole
              size={
                18
              }
            />
          )}
        </div>

        <h1 className="mt-5 text-2xl font-extrabold tracking-[-0.035em] text-white sm:text-3xl">
          {mode ===
          "watchmen"
            ? "Watchmen access"
            : "Admin access"}
        </h1>

        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
          {mode ===
          "watchmen"
            ? "Enter the Watchmen PIN to access prayer assignments."
            : "Enter your assigned PIN to continue to The Witness Path administration portal."}
        </p>
      </div>

      {/* =============================
          PIN
      ============================= */}

      <label
        htmlFor="admin-pin"
        className="mb-2 block text-xs font-bold text-slate-300"
      >
        {mode ===
        "watchmen"
          ? "Watchmen PIN"
          : "Admin PIN"}
      </label>

      <div className="relative">
        <input
          id="admin-pin"
          type={
            showPin
              ? "text"
              : "password"
          }
          value={
            pin
          }
          onChange={(
            event
          ) => {
            setPin(
              event.target
                .value
            );

            if (
              message
            ) {
              setMessage(
                ""
              );
            }
          }}
          disabled={
            submitting
          }
          autoComplete="current-password"
          autoFocus
          placeholder="Enter PIN"
          className="h-12 w-full rounded-xl border border-white/10 bg-primary px-4 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-accent/50 focus:ring-4 focus:ring-accent/10 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="button"
          onClick={() =>
            setShowPin(
              (
                current
              ) =>
                !current
            )
          }
          disabled={
            submitting
          }
          className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
          aria-label={
            showPin
              ? "Hide PIN"
              : "Show PIN"
          }
        >
          {showPin ? (
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

      {/* =============================
          ERROR MESSAGE
      ============================= */}

      {message && (
        <div
          role="alert"
          className="mt-3 rounded-xl border border-red-500/20 bg-red-500/5 px-3.5 py-3"
        >
          <p className="text-xs font-medium leading-5 text-red-400">
            {
              message
            }
          </p>
        </div>
      )}

      {/* =============================
          SUBMIT
      ============================= */}

      <button
        type="submit"
        disabled={
          submitting ||
          !pin.trim()
        }
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 text-xs font-extrabold text-primary transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting ? (
          <>
            <Loader2
              size={
                14
              }
              className="animate-spin"
            />

            Verifying...
          </>
        ) : (
          <>
            Continue

            <ArrowRight
              size={
                15
              }
            />
          </>
        )}
      </button>

      <p className="mt-5 text-center text-[10px] leading-5 text-slate-600">
        Authorized internal access
        only.
      </p>
    </form>
  );
}