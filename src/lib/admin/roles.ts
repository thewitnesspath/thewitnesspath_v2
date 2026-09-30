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

export function normalizeAdminRole(
  value: unknown
): AdminRole | null {
  if (
    typeof value !== "string"
  ) {
    return null;
  }

  const role =
    value
      .trim()
      .toLowerCase();

  if (!role) {
    return null;
  }

  if (role === "blogger") {
    return "blogger";
  }

  if (
    role === "counselor"
  ) {
    return "counselor";
  }

  /*
   * Watchmen do not come through
   * verify_admin_pin.
   * They use verify_watchmen_pin.
   */

  return "main";
}

export function canAccessAdminSection(
  role: AdminRole,
  section: AdminSection
) {
  if (role === "main") {
    return true;
  }

  if (
    role === "watchmen"
  ) {
    return (
      section === "watchmen"
    );
  }

  if (
    role === "blogger"
  ) {
    return [
      "overview",
      "blog",
      "word",
    ].includes(section);
  }

  if (
    role === "counselor"
  ) {
    return [
      "overview",
      "guidance",
    ].includes(section);
  }

  return false;
}

export function getAdminRoleLabel(
  role: AdminRole
) {
  if (
    role === "blogger"
  ) {
    return "Blogger";
  }

  if (
    role === "counselor"
  ) {
    return "Counselor";
  }

  if (
    role === "watchmen"
  ) {
    return "Watchmen";
  }

  return "Main Admin";
}