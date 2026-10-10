export type AdminRole =
  | "main"
  | "blogger"
  | "counselor"
  | "watchmen";

export type AdminSection =
  | "overview"
  | "testimonies"
  | "blog"
  | "guidance"
  | "prayer"
  | "word"
  | "vision"
  | "moderation"
  | "watchmen";

/*
 * Convert the role returned by
 * verify_admin_pin into one of the
 * roles recognised by the app.
 *
 * IMPORTANT:
 * Unknown values must NEVER fall
 * back to Main Admin.
 */
export function normalizeAdminRole(
  value: unknown
): AdminRole | null {
  if (
    typeof value !==
    "string"
  ) {
    return null;
  }

  const role =
    value
      .trim()
      .toLowerCase();

  if (
    role === "main"
  ) {
    return "main";
  }

  if (
    role === "blogger"
  ) {
    return "blogger";
  }

  if (
    role === "counselor"
  ) {
    return "counselor";
  }

  /*
   * Watchmen are intentionally
   * excluded here.
   *
   * They authenticate using
   * verify_watchmen_pin rather than
   * verify_admin_pin.
   */
  return null;
}

/*
 * UI-level section visibility.
 *
 * Every sensitive API route must
 * still perform its own server-side
 * authorization.
 */
export function canAccessAdminSection(
  role: AdminRole,
  section: AdminSection
) {
  if (
    role === "main"
  ) {
    return true;
  }

  if (
    role === "watchmen"
  ) {
    return (
      section ===
      "watchmen"
    );
  }

  if (
    role === "blogger"
  ) {
    return [
      "overview",
      "blog",
      "word",
    ].includes(
      section
    );
  }

  if (
    role === "counselor"
  ) {
    return [
      "overview",
      "guidance",
    ].includes(
      section
    );
  }

  return false;
}

export function getAdminRoleLabel(
  role: AdminRole
) {
  switch (
    role
  ) {
    case "main":
      return "Main Admin";

    case "blogger":
      return "Blogger";

    case "counselor":
      return "Counselor";

    case "watchmen":
      return "Watchmen";
  }
}