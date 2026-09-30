import Link from "next/link";
import HeroCarousel from "@/components/home/HeroCarousel";
import {
  listTestimonies,
  wordOfTheWeek,
  type WordOfWeek,
} from "@/lib/content/index";

type Testimony = Awaited<ReturnType<typeof listTestimonies>>[number];

function createExcerpt(text: string, limit = 220) {
  const cleanText = text.trim();

  if (!cleanText) return "";
  if (cleanText.length <= limit) return cleanText;

  return `${cleanText.slice(0, limit).trimEnd()}…`;
}

export default async function HomePage() {
  let testimonies: Testimony[] = [];
  let weekly: WordOfWeek | null = null;

  try {
    [testimonies, weekly] = await Promise.all([
      listTestimonies(),
      wordOfTheWeek(),
    ]);
  } catch {
    // Keep the public homepage available during a content-service outage.
  }

  const featured = testimonies[0] ?? null;

  return (
    <main className="overflow-hidden bg-[#fbfaf6] text-[#1d201d]">
      {/* HERO */}
      <section
        aria-labelledby="home-hero-title"
        className="relative border-b border-black/[0.06]"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_12%,rgba(184,138,69,0.10),transparent_32%)]" />

        <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 items-center gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-10 lg:py-20 xl:gap-24">
          <div className="max-w-[620px]">
            <div className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b88a45]">
              <span className="h-px w-7 bg-current" />
              Global faith &amp; testimony sanctuary
            </div>

            <h1
              id="home-hero-title"
              className="max-w-[760px] text-[clamp(3rem,7vw,6.8rem)] font-medium leading-[0.93] tracking-[-0.06em]"
            >
              Your testimony of grace is{" "}
              <span className="font-serif font-normal italic text-[#b88a45]">
                someone else&apos;s breakthrough.
              </span>
            </h1>

            <p className="mt-7 max-w-[570px] text-[15px] leading-7 text-[#73766f] sm:text-base lg:text-[17px]">
              Amplify what God has done. Strengthen weary hearts. A sanctuary
              to preserve and share real stories of provision, healing, and
              restoration.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/testimonies"
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#b88a45] px-5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#a87835]"
              >
                Read Testimonies

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href="/share"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/10 px-5 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 hover:border-[#1d201d] hover:bg-[#1d201d] hover:text-white"
              >
                Share Your Testimony
              </Link>
            </div>

            <div className="mt-7 flex max-w-md items-start gap-3 text-xs leading-5 text-[#7b7d77]">
              <span
                aria-hidden="true"
                className="mt-[1px] text-[#b88a45]"
              >
                ✦
              </span>

              <span>
                Real stories. Carefully preserved. Shared to strengthen faith.
              </span>
            </div>
          </div>

          <HeroCarousel />
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-10">
        {/* FEATURED */}
        <section
          aria-labelledby="featured-content-heading"
          className="py-16 sm:py-20 lg:py-24"
        >
          <div className="mb-8 max-w-2xl">
            <div className="mb-3 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b88a45]">
              <span className="h-px w-6 bg-current" />
              For your journey
            </div>

            <h2
              id="featured-content-heading"
              className="font-serif text-3xl leading-tight tracking-[-0.03em] sm:text-4xl lg:text-5xl"
            >
              Grace remembered. Truth carried forward.
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* TESTIMONY OF THE DAY */}
            <article className="group flex min-h-[360px] flex-col justify-between rounded-[26px] border border-[#d8c6a7] bg-[#f3eadb] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(38,31,20,0.08)] sm:p-8">
              <div>
                <div className="mb-10 flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9b6d2c]">
                    <span aria-hidden="true">✦</span>
                    Testimony of the Day
                  </span>

                  {featured && (
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#827562]">
                      {featured.category || "Faith"}
                    </span>
                  )}
                </div>

                <h3 className="max-w-xl font-serif text-3xl leading-[1.08] tracking-[-0.035em] sm:text-4xl">
                  {featured?.title || "Stories of grace are on their way"}
                </h3>

                <p className="mt-3 text-xs font-medium text-[#927f62]">
                  {featured
                    ? `By ${featured.author || "Anonymous"}`
                    : "The Witness Team"}
                </p>

                <p className="mt-6 max-w-xl text-sm leading-7 text-[#615d55] sm:text-[15px]">
                  {featured
                    ? createExcerpt(featured.content || "")
                    : "Approved testimonies will appear here as they are shared and prepared for the community."}
                </p>
              </div>

              {featured ? (
                <Link
                  href={`/testimonies/${featured.id}`}
                  className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#6f5125]"
                >
                  Read full testimony

                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              ) : (
                <Link
                  href="/testimonies"
                  className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#6f5125]"
                >
                  Explore testimonies
                  <span>→</span>
                </Link>
              )}
            </article>

            {/* WORD OF THE WEEK */}
            <article className="group flex min-h-[360px] flex-col justify-between rounded-[26px] border border-[#cbd7d9] bg-[#e9efef] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(25,42,47,0.08)] sm:p-8">
              <div>
                <div className="mb-10 flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#55707a]">
                    <span aria-hidden="true">▤</span>
                    Word of the Week
                  </span>

                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6e7e82]">
                    {weekly?.author || "The Witness Team"}
                  </span>
                </div>

                <h3 className="max-w-xl font-serif text-3xl leading-[1.08] tracking-[-0.035em] sm:text-4xl">
                  {weekly?.title || "A word for the journey"}
                </h3>

                <p className="mt-6 max-w-xl text-sm leading-7 text-[#596668] sm:text-[15px]">
                  {weekly?.content ||
                    "A weekly reflection for faith, encouragement, and the journey ahead."}
                </p>
              </div>

              <Link
                href="/word-of-the-week"
                className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#425d66]"
              >
                Continue reading

                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </article>
          </div>
        </section>

        {/* CTAs */}
        <section
          aria-labelledby="find-your-place-heading"
          className="border-t border-black/[0.07] py-16 sm:py-20 lg:py-24"
        >
          <div className="mb-10 max-w-2xl">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b88a45]">
              Find your place
            </span>

            <h2
              id="find-your-place-heading"
              className="mt-3 font-serif text-3xl tracking-[-0.035em] sm:text-4xl lg:text-5xl"
            >
              Read a story. Share your own.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#73766f] sm:text-[15px]">
              Whether you came looking for encouragement or carrying a story of
              your own, there is room for you here.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* READ */}
            <Link
              href="/testimonies"
              className="group flex min-h-[390px] flex-col justify-between overflow-hidden rounded-[28px] bg-[#202820] p-6 text-white transition duration-300 hover:-translate-y-1 sm:p-8 lg:p-10"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-sm text-white/50">
                  01
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
                  Encouragement
                </span>
              </div>

              <div className="max-w-md">
                <h3 className="font-serif text-4xl tracking-[-0.04em] sm:text-5xl">
                  Read testimonies
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/65">
                  Discover real accounts of God&apos;s faithfulness and find
                  courage for your own journey.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-white/15 pt-5 text-sm font-semibold">
                <span>Explore the stories</span>

                <span className="text-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                  ↗
                </span>
              </div>
            </Link>

            {/* SHARE */}
            <Link
              href="/share"
              className="group flex min-h-[390px] flex-col justify-between overflow-hidden rounded-[28px] border border-[#d4bea0] bg-[#c99e61] p-6 text-[#241b10] transition duration-300 hover:-translate-y-1 sm:p-8 lg:p-10"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-sm text-black/45">
                  02
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45">
                  Your voice
                </span>
              </div>

              <div className="max-w-md">
                <h3 className="font-serif text-4xl tracking-[-0.04em] sm:text-5xl">
                  Share a testimony
                </h3>

                <p className="mt-4 text-sm leading-7 text-black/65">
                  Tell others what God has done. Your story could strengthen
                  someone who is still waiting.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-black/15 pt-5 text-sm font-semibold">
                <span>Tell your story</span>

                <span className="text-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                  ↗
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* PLATFORM PATHS */}
        <section
          aria-labelledby="platform-paths-heading"
          className="border-t border-black/[0.07] py-16 sm:py-20"
        >
          <div className="mb-8 max-w-xl">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b88a45]">
              More than stories
            </span>

            <h2
              id="platform-paths-heading"
              className="mt-3 font-serif text-3xl tracking-[-0.035em] sm:text-4xl"
            >
              A place to witness, ask and pray.
            </h2>
          </div>

          <div className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
            <Link
              href="/testimonies"
              className="group grid grid-cols-[40px_1fr_auto] items-start gap-4 py-7 transition sm:grid-cols-[70px_1fr_auto] sm:py-8"
            >
              <span className="font-serif text-sm text-[#b88a45]">
                01
              </span>

              <div>
                <h3 className="text-lg font-semibold sm:text-xl">
                  Enduring Testimonies
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[#73766f]">
                  Stories to return to in seasons of waiting, uncertainty, and
                  remembrance.
                </p>
              </div>

              <span className="text-lg transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                ↗
              </span>
            </Link>

            <Link
              href="/guidance"
              className="group grid grid-cols-[40px_1fr_auto] items-start gap-4 py-7 transition sm:grid-cols-[70px_1fr_auto] sm:py-8"
            >
              <span className="font-serif text-sm text-[#b88a45]">
                02
              </span>

              <div>
                <h3 className="text-lg font-semibold sm:text-xl">
                  Safe Haven &amp; Guidance
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[#73766f]">
                  Bring questions and quiet burdens into a thoughtful, caring
                  space.
                </p>
              </div>

              <span className="text-lg transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                ↗
              </span>
            </Link>

            <Link
              href="/prayer"
              className="group grid grid-cols-[40px_1fr_auto] items-start gap-4 py-7 transition sm:grid-cols-[70px_1fr_auto] sm:py-8"
            >
              <span className="font-serif text-sm text-[#b88a45]">
                03
              </span>

              <div>
                <h3 className="text-lg font-semibold sm:text-xl">
                  Intercession &amp; Prayer
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[#73766f]">
                  Share a request and stand together with others in prayer.
                </p>
              </div>

              <span className="text-lg transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                ↗
              </span>
            </Link>
          </div>
        </section>

        {/* SCRIPTURE */}
        <section
          aria-labelledby="scripture-heading"
          className="mb-6 overflow-hidden rounded-[30px] bg-[#202820] px-6 py-14 text-center text-white sm:px-10 sm:py-20 lg:px-20 lg:py-24"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d6b77c]">
            The heart of the path
          </span>

          <blockquote
            id="scripture-heading"
            className="mx-auto mt-6 max-w-4xl font-serif text-3xl leading-[1.12] tracking-[-0.04em] sm:text-4xl lg:text-5xl"
          >
            “And they overcame him by the blood of the Lamb and by the word of
            their testimony...”
          </blockquote>

          <span className="mt-5 block text-xs uppercase tracking-[0.16em] text-white/45">
            Revelation 12:11
          </span>

          <Link
            href="/testimonies"
            className="group mx-auto mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-white px-5 text-sm font-semibold text-[#202820] transition hover:-translate-y-0.5"
          >
            Enter the Witness Sanctuary

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </section>
      </div>
    </main>
  );
}