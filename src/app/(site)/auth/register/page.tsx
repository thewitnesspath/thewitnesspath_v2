import {
  HeartHandshake,
  Sparkles,
} from "lucide-react";

import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title:
    "Create Account | The Witness Path",

  description:
    "Create your account on The Witness Path.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#FFFDF8] px-4 pb-16 pt-28 text-[#07162E] dark:bg-[#06111F] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-[1120px] overflow-hidden rounded-[26px] border border-[#07162E]/10 bg-white shadow-[0_30px_90px_rgba(7,22,46,0.08)] lg:grid-cols-[0.95fr_1.05fr] dark:border-white/10 dark:bg-[#0B1A2A] dark:shadow-none">
        <section className="hidden min-h-[710px] flex-col justify-between bg-[#07162E] p-10 text-white lg:flex">
          <div>
            <Sparkles
              size={
                20
              }
              className="text-[#F59E0B]"
            />

            <p className="mt-6 text-[9px] font-extrabold uppercase tracking-[0.23em] text-[#F59E0B]">
              The Witness Path
            </p>

            <h2 className="mt-4 max-w-md font-serif text-5xl leading-[0.95] tracking-[-0.055em]">
              Every witness
              has the power to
              strengthen another.
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <HeartHandshake
              size={
                18
              }
              className="text-[#F59E0B]"
            />

            <p className="mt-4 max-w-sm text-sm leading-7 text-white/65">
              Join a platform built
              to preserve what God
              has done and place
              evidence of His
              faithfulness within
              reach.
            </p>
          </div>
        </section>

        <section className="flex min-h-[710px] items-center p-6 sm:p-10 lg:p-14">
          <div className="mx-auto w-full max-w-[440px]">
            <RegisterForm />
          </div>
        </section>
      </div>
    </main>
  );
}