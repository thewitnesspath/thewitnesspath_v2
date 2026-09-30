"use client";

import {
  Check,
  Eye,
  Loader2,
  RefreshCw,
  Save,
  Target,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";

import RichTextEditor from "@/components/editor/RichTextEditor";
import FormattedContent from "@/components/editor/FormattedContent";

type Result = {
  success: boolean;

  content: {
    vision: string;
    mission: string;

    updatedAt?:
      | string
      | null;
  };
};

export default function VisionMissionWorkspace() {
  const [
    vision,
    setVision,
  ] = useState("");

  const [
    mission,
    setMission,
  ] = useState("");

  const [
    updatedAt,
    setUpdatedAt,
  ] =
    useState<
      string | null
    >(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    preview,
    setPreview,
  ] = useState<
    "vision" | "mission"
  >("vision");

  const load =
    useCallback(async () => {
      setLoading(true);
      setError("");
      setMessage("");

      try {
        const response =
          await fetch(
            "/api/admin/vision",
            {
              cache:
                "no-store",
            }
          );

        const result:
          Result =
          await response.json();

        if (!response.ok) {
          throw new Error();
        }

        setVision(
          result.content
            .vision
        );

        setMission(
          result.content
            .mission
        );

        setUpdatedAt(
          result.content
            .updatedAt ??
            null
        );
      } catch {
        setError(
          "Vision & Mission content could not be loaded."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (
    event:
      FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !vision.trim() ||
      !mission.trim()
    ) {
      setError(
        "Both Vision and Mission are required."
      );

      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response =
        await fetch(
          "/api/admin/vision",
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                vision,
                mission,
              }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        setError(
          result.message ||
            "Unable to save Vision & Mission."
        );

        return;
      }

      setUpdatedAt(
        result.content
          .updatedAt ??
          null
      );

      setMessage(
        "Vision & Mission updated successfully."
      );
    } catch {
      setError(
        "Unable to save Vision & Mission."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="h-7 w-52 animate-pulse rounded-lg bg-secondary" />

        <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-secondary" />

        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          <div className="h-[420px] animate-pulse rounded-2xl border border-white/10 bg-secondary" />

          <div className="h-[420px] animate-pulse rounded-2xl border border-white/10 bg-secondary" />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-accent">
            Platform identity
          </span>

          <h1 className="mt-3 text-2xl font-extrabold tracking-[-0.035em] text-white">
            Vision & Mission
          </h1>

          <p className="mt-2 max-w-xl text-xs leading-6 text-slate-500">
            Manage the core direction
            presented on The Witness
            Path Vision page.
          </p>
        </div>

        <button
          type="button"
          onClick={load}
          className="inline-flex min-h-9 w-fit items-center gap-2 rounded-xl border border-white/10 px-3 text-[11px] font-bold text-slate-400 transition hover:border-accent/30 hover:text-accent"
        >
          <RefreshCw
            size={13}
          />

          Reload
        </button>
      </div>

      {/* MIGRATION NOTE */}
      {!vision &&
        !mission && (
          <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/5 p-4">
            <p className="text-xs font-bold text-accent">
              Content migration
              required
            </p>

            <p className="mt-2 max-w-3xl text-xs leading-6 text-slate-400">
              The editable database
              record is ready, but the
              existing public Vision
              and Mission wording has
              not been copied into it
              yet. We will transfer
              the exact current wording
              when we rebuild the
              public Vision page.
            </p>
          </div>
        )}

      {message && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 text-xs text-slate-300">
          <Check
            size={13}
            className="shrink-0 text-accent"
          />

          {message}
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-300">
          {error}
        </div>
      )}

      <form
        onSubmit={submit}
        className="mt-6"
      >
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          {/* EDITORS */}
          <div className="space-y-5">
            <section className="rounded-2xl border border-white/10 bg-secondary p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                  <Eye
                    size={15}
                  />
                </div>

                <div>
                  <h2 className="text-sm font-extrabold text-white">
                    Vision
                  </h2>

                  <p className="mt-1 text-[10px] text-slate-600">
                    What The Witness
                    Path is called to
                    see fulfilled.
                  </p>
                </div>
              </div>

              <RichTextEditor
                label="Vision content"
                value={vision}
                onChange={
                  setVision
                }
                rows={10}
                placeholder="Paste the existing Vision wording here..."
              />
            </section>

            <section className="rounded-2xl border border-white/10 bg-secondary p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                  <Target
                    size={15}
                  />
                </div>

                <div>
                  <h2 className="text-sm font-extrabold text-white">
                    Mission
                  </h2>

                  <p className="mt-1 text-[10px] text-slate-600">
                    How the platform
                    pursues that
                    direction.
                  </p>
                </div>
              </div>

              <RichTextEditor
                label="Mission content"
                value={mission}
                onChange={
                  setMission
                }
                rows={10}
                placeholder="Paste the existing Mission wording here..."
              />
            </section>
          </div>

          {/* LIVE PREVIEW */}
          <aside className="xl:sticky xl:top-[88px] xl:self-start">
            <div className="rounded-2xl border border-white/10 bg-secondary p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-slate-600">
                  Live preview
                </p>

                <div className="flex rounded-lg border border-white/10 bg-primary p-1">
                  <button
                    type="button"
                    onClick={() =>
                      setPreview(
                        "vision"
                      )
                    }
                    className={`rounded-md px-2.5 py-1.5 text-[9px] font-bold transition ${
                      preview ===
                      "vision"
                        ? "bg-accent text-primary"
                        : "text-slate-500"
                    }`}
                  >
                    Vision
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setPreview(
                        "mission"
                      )
                    }
                    className={`rounded-md px-2.5 py-1.5 text-[9px] font-bold transition ${
                      preview ===
                      "mission"
                        ? "bg-accent text-primary"
                        : "text-slate-500"
                    }`}
                  >
                    Mission
                  </button>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-white/10 bg-primary p-4">
                <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-accent">
                  {preview ===
                  "vision"
                    ? "Our Vision"
                    : "Our Mission"}
                </span>

                <div className="mt-4 font-serif text-sm leading-7 text-slate-300">
                  {(preview ===
                    "vision"
                    ? vision
                    : mission
                  ).trim() ? (
                    <FormattedContent
                      content={
                        preview ===
                        "vision"
                          ? vision
                          : mission
                      }
                    />
                  ) : (
                    <p className="text-xs text-slate-600">
                      No content has
                      been migrated
                      yet.
                    </p>
                  )}
                </div>
              </div>

              {updatedAt && (
                <p className="mt-3 text-[9px] text-slate-600">
                  Last updated{" "}
                  {new Intl.DateTimeFormat(
                    "en",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute:
                        "2-digit",
                    }
                  ).format(
                    new Date(
                      updatedAt
                    )
                  )}
                </p>
              )}
            </div>
          </aside>
        </div>

        {/* SAVE BAR */}
        <div className="sticky bottom-4 z-20 mt-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-secondary/95 p-3 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <p className="px-1 text-[10px] leading-5 text-slate-500">
            Changes affect the public
            Vision & Mission page
            once that page is connected
            to this record.
          </p>

          <button
            type="submit"
            disabled={
              saving ||
              !vision.trim() ||
              !mission.trim()
            }
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-xs font-extrabold text-primary transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? (
              <Loader2
                size={13}
                className="animate-spin"
              />
            ) : (
              <Save
                size={13}
              />
            )}

            {saving
              ? "Saving..."
              : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}