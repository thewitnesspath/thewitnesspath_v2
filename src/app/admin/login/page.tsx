import {
  redirect,
} from "next/navigation";

import AdminLoginForm from "@/components/admin/AdminLoginForm";

import {
  getAdminSession,
} from "@/lib/admin/session";

export default async function AdminLoginPage() {
  const session =
    await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-primary px-4 py-8 text-white sm:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-[1100px] overflow-hidden rounded-[28px] border border-white/10 bg-secondary shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
        {/* BRAND SIDE */}
        <section className="relative hidden overflow-hidden border-r border-white/10 p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <img
              src="/logo.png"
              alt="The Witness Path"
              className="h-10 w-auto object-contain object-left"
            />
          </div>

          <div className="max-w-md">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-accent">
              Administration
            </span>

            <h2 className="mt-4 text-4xl font-extrabold leading-[1.06] tracking-[-0.045em] text-white">
              Steward the platform
              from one place.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-400">
              Manage testimonies,
              teachings, guidance,
              prayer, weekly content
              and platform
              moderation.
            </p>
          </div>

          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
            Witness His grace.
            Strengthen your faith.
          </p>
        </section>

        {/* LOGIN SIDE */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-[390px]">
            <div className="mb-8 lg:hidden">
              <img
                src="/logo.png"
                alt="The Witness Path"
                className="h-9 w-auto"
              />
            </div>

            <AdminLoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}