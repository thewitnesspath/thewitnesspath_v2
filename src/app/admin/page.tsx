import {
  redirect,
} from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";

import {
  getAdminSession,
} from "@/lib/admin/session";

export default async function AdminPage() {
  const session =
    await getAdminSession();

  if (!session) {
    redirect(
      "/admin/login"
    );
  }

  return (
    <AdminShell
      role={session.role}
    />
  );
}