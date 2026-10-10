import {
  Quote,
  Sparkles,
} from "lucide-react";

import LoginForm from "@/components/auth/LoginForm";

type Props = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export const metadata = {
  title:
    "Sign In | The Witness Path",

  description:
    "Sign in to your account on The Witness Path.",
};

export default async function LoginPage({
  searchParams,
}: Props) {
  const params =
    await searchParams;

  return (
    <main className="min-h-screen bg-[#FFFDF8] px-4 pb-16 pt-28 text-[#07162E] dark:bg-[#06111F] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-[1120px] overflow-hidden rounded-[26px] border border-[#07162E]/10 bg-white shadow-[0_30px_90px_rgba(7,22,46,0.08)] lg:grid-cols-[0.95fr_1.05fr] dark:border-white/10 dark:bg-[#0B1A2A] dark:shadow-none">
        <section className="hidden min-h-[650px] flex-col justify-between bg-[#07162E] p-10 text-white lg:flex">
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
              A place where
              testimony becomes
              a pathway to hope.
            </h2>
          </div>

          <div className="border-l-2 border-[#F59E0B] pl-6">
            <Quote
              size={
                17
              }
              className="text-[#F59E0B]"
            />

            <p className="mt-4 max-w-sm font-serif text-xl italic leading-8 text-white/80">
              Come and hear, all ye
              that fear God, and I
              will declare what he
              hath done for my soul.
            </p>

            <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.18em] text-white/40">
              Psalm 66:16
            </p>
          </div>
        </section>

        <section className="flex min-h-[650px] items-center p-6 sm:p-10 lg:p-14">
          <div className="mx-auto w-full max-w-[440px]">
            <LoginForm
              nextPath={
                params.next
              }
            />
          </div>
        </section>
      </div>
    </main>
  );
}