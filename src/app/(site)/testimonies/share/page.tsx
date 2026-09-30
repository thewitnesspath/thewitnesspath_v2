import Link from "next/link";
import ShareTestimonyForm from "@/components/testimony/ShareTestimonyForm";

export const metadata = {
  title: "Share Your Testimony",
  description:
    "Share what God has done and encourage someone else through your testimony.",
};

export default function ShareTestimonyPage() {
  return (
    <main className="bg-[#fbfaf6]">
      <section className="border-b border-black/[0.06]">
        <div className="mx-auto w-full max-w-[1050px] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
          <Link
            href="/testimonies"
            className="text-xs font-semibold text-[#777a74] transition hover:text-[#1d201d]"
          >
            ← Back to testimonies
          </Link>

          <div className="mt-10 max-w-3xl">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b88a45]">
              Your voice matters
            </span>

            <h1 className="mt-4 font-serif text-4xl leading-[1.03] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              Tell the story of{" "}
              <span className="text-[#b88a45]">
                what God has done.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#73766f] sm:text-base">
              You do not need perfect words. Share honestly,
              thoughtfully, and at your own pace.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[900px] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <ShareTestimonyForm />
      </section>
    </main>
  );
}