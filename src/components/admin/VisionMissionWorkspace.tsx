"use client";

import {
  Check,
  Eye,
  Loader2,
  RefreshCw,
  RotateCcw,
  Save,
  Target,
  TriangleAlert,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import RichTextEditor from "@/components/editor/RichTextEditor";

import FormattedContent from "@/components/editor/FormattedContent";

import type {
  VisionMissionContent,
} from "@/lib/types/vision-mission";

type Result = {
  success: boolean;

  content:
    VisionMissionContent;
};

function formatUpdatedAt(
  value: string
) {
  try {
    return new Intl.DateTimeFormat(
      "en",
      {
        day:
          "numeric",

        month:
          "short",

        year:
          "numeric",

        hour:
          "numeric",

        minute:
          "2-digit",
      }
    ).format(
      new Date(
        value
      )
    );
  } catch {
    return "";
  }
}

export default function VisionMissionWorkspace() {
  const [
    vision,
    setVision,
  ] =
    useState("");

  const [
    mission,
    setMission,
  ] =
    useState("");

  /*
   * Last successfully loaded/saved
   * values. These let us identify
   * unsaved changes.
   */
  const [
    savedVision,
    setSavedVision,
  ] =
    useState("");

  const [
    savedMission,
    setSavedMission,
  ] =
    useState("");

  const [
    updatedAt,
    setUpdatedAt,
  ] =
    useState<
      string | null
    >(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    saving,
    setSaving,
  ] =
    useState(
      false
    );

  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    conflict,
    setConflict,
  ] =
    useState(
      false
    );

  const [
    preview,
    setPreview,
  ] =
    useState<
      "vision" |
      "mission"
    >(
      "vision"
    );

  /*
   * Unsaved state.
   */
  const dirty =
    useMemo(
      () =>
        vision !==
          savedVision ||
        mission !==
          savedMission,
      [
        vision,
        mission,
        savedVision,
        savedMission,
      ]
    );

  /*
   * =================================
   * LOAD
   * =================================
   */
  const load =
    useCallback(
      async () => {
        setLoading(
          true
        );

        setError(
          ""
        );

        setMessage(
          ""
        );

        setConflict(
          false
        );

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
            Result &
            {
              message?:
                string;
            } =
            await response.json();

          if (
            !response.ok
          ) {
            throw new Error(
              result.message ||
                "Vision & Mission content could not be loaded."
            );
          }

          const nextVision =
            result.content
              .vision ??
            "";

          const nextMission =
            result.content
              .mission ??
            "";

          setVision(
            nextVision
          );

          setMission(
            nextMission
          );

          setSavedVision(
            nextVision
          );

          setSavedMission(
            nextMission
          );

          setUpdatedAt(
            result.content
              .updatedAt ??
            null
          );
        } catch (
          loadError
        ) {
          setError(
            loadError instanceof
              Error &&
              loadError.message
              ? loadError.message
              : "Vision & Mission content could not be loaded."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      []
    );

  useEffect(() => {
    load();
  }, [
    load,
  ]);

  /*
   * =================================
   * RESET UNSAVED CHANGES
   * =================================
   */
  const resetChanges =
    () => {
      if (
        saving
      ) {
        return;
      }

      setVision(
        savedVision
      );

      setMission(
        savedMission
      );

      setError(
        ""
      );

      setMessage(
        "Unsaved changes discarded."
      );

      setConflict(
        false
      );
    };

  /*
   * =================================
   * SAVE
   * =================================
   */
  const submit =
    async (
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

      if (
        !dirty
      ) {
        setMessage(
          "There are no new changes to save."
        );

        return;
      }

      setSaving(
        true
      );

      setError(
        ""
      );

      setMessage(
        ""
      );

      setConflict(
        false
      );

      try {
        const response =
          await fetch(
            "/api/admin/vision",
            {
              method:
                "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  vision:
                    vision.trim(),

                  mission:
                    mission.trim(),

                  /*
                   * Protect against
                   * stale-tab overwrites.
                   */
                  expectedUpdatedAt:
                    updatedAt,
                }),
            }
          );

        const result =
          await response.json();

        if (
          response.status ===
          409
        ) {
          setConflict(
            true
          );

          setError(
            result.message ||
              "Vision & Mission has changed in another session."
          );

          return;
        }

        if (
          !response.ok
        ) {
          setError(
            result.message ||
              "Unable to save Vision & Mission."
          );

          return;
        }

        const nextVision =
          result.content
            .vision ??
          "";

        const nextMission =
          result.content
            .mission ??
          "";

        setVision(
          nextVision
        );

        setMission(
          nextMission
        );

        setSavedVision(
          nextVision
        );

        setSavedMission(
          nextMission
        );

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
        setSaving(
          false
        );
      }
    };

  /*
   * =================================
   * LOADING
   * =================================
   */
  if (
    loading
  ) {
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

  const noStoredContent =
    !savedVision.trim() &&
    !savedMission.trim();

  return (
    <div>
      {/* =================================
          HEADER
      ================================= */}

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

        <div className="flex flex-wrap items-center gap-2">
          {dirty && (
            <span className="inline-flex min-h-9 items-center rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 text-[10px] font-bold text-amber-300">
              Unsaved changes
            </span>
          )}

          <button
            type="button"
            onClick={
              load
            }
            disabled={
              saving
            }
            className="inline-flex min-h-9 w-fit items-center gap-2 rounded-xl border border-white/10 px-3 text-[11px] font-bold text-slate-400 transition hover:border-accent/30 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RefreshCw
              size={
                13
              }
            />

            Reload
          </button>
        </div>
      </div>

      {/* =================================
          INITIAL CONTENT NOTE
      ================================= */}

      {noStoredContent && (
        <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/5 p-4">
          <p className="text-xs font-bold text-accent">
            Vision & Mission record
            is ready
          </p>

          <p className="mt-2 max-w-3xl text-xs leading-6 text-slate-400">
            No Vision or Mission
            wording is currently
            stored in the editable
            record. Enter the approved
            wording below and save it
            when ready.
          </p>
        </div>
      )}

      {/* =================================
          CONFLICT
      ================================= */}

      {conflict && (
        <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-start gap-3">
            <TriangleAlert
              size={
                16
              }
              className="mt-0.5 shrink-0 text-amber-300"
            />

            <div>
              <p className="text-xs font-bold text-amber-300">
                A newer version exists
              </p>

              <p className="mt-1 text-[11px] leading-5 text-slate-400">
                Vision & Mission was
                changed after this
                editor was loaded.
                Reload the latest
                version before making
                another update.
              </p>

              <button
                type="button"
                onClick={
                  load
                }
                className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-xl border border-amber-500/20 px-3.5 text-[10px] font-bold text-amber-300 transition hover:bg-amber-500/10"
              >
                <RefreshCw
                  size={
                    12
                  }
                />

                Load latest version
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================
          SUCCESS MESSAGE
      ================================= */}

      {message && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 text-xs text-slate-300">
          <Check
            size={
              13
            }
            className="shrink-0 text-accent"
          />

          {
            message
          }
        </div>
      )}

      {/* =================================
          ERROR
      ================================= */}

      {error && (
        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-300">
          {
            error
          }
        </div>
      )}

      {/* =================================
          FORM
      ================================= */}

      <form
        onSubmit={
          submit
        }
        className="mt-6"
      >
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          {/* =============================
              EDITORS
          ============================= */}

          <div className="space-y-5">
            {/* VISION */}

            <section className="rounded-2xl border border-white/10 bg-secondary p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                  <Eye
                    size={
                      15
                    }
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
                value={
                  vision
                }
                onChange={
                  setVision
                }
                rows={
                  10
                }
                placeholder="Write the Vision..."
              />
            </section>

            {/* MISSION */}

            <section className="rounded-2xl border border-white/10 bg-secondary p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                  <Target
                    size={
                      15
                    }
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
                value={
                  mission
                }
                onChange={
                  setMission
                }
                rows={
                  10
                }
                placeholder="Write the Mission..."
              />
            </section>
          </div>

          {/* =============================
              LIVE PREVIEW
          ============================= */}

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
                        : "text-slate-500 hover:text-white"
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
                        : "text-slate-500 hover:text-white"
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

                <div className="mt-4 max-h-[520px] overflow-y-auto font-serif text-sm leading-7 text-slate-300">
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
                    <p className="text-xs leading-6 text-slate-600">
                      No content has
                      been entered yet.
                    </p>
                  )}
                </div>
              </div>

              {updatedAt && (
                <p className="mt-3 text-[9px] leading-5 text-slate-600">
                  Last saved{" "}
                  {
                    formatUpdatedAt(
                      updatedAt
                    )
                  }
                </p>
              )}
            </div>
          </aside>
        </div>

        {/* =================================
            SAVE BAR
        ================================= */}

        <div className="sticky bottom-4 z-20 mt-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-secondary/95 p-3 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="px-1">
            <p className="text-[10px] leading-5 text-slate-500">
              Vision and Mission are
              stored together as the
              platform&apos;s central
              identity record.
            </p>

            {dirty && (
              <p className="mt-0.5 text-[9px] font-bold text-amber-300">
                You have unsaved
                changes.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            {dirty && (
              <button
                type="button"
                onClick={
                  resetChanges
                }
                disabled={
                  saving
                }
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-xs font-bold text-slate-400 transition hover:border-white/20 hover:text-white disabled:opacity-40"
              >
                <RotateCcw
                  size={
                    13
                  }
                />

                Discard changes
              </button>
            )}

            <button
              type="submit"
              disabled={
                saving ||
                !dirty ||
                !vision.trim() ||
                !mission.trim() ||
                conflict
              }
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-xs font-extrabold text-primary transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? (
                <Loader2
                  size={
                    13
                  }
                  className="animate-spin"
                />
              ) : (
                <Save
                  size={
                    13
                  }
                />
              )}

              {saving
                ? "Saving..."
                : dirty
                  ? "Save changes"
                  : "Saved"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}