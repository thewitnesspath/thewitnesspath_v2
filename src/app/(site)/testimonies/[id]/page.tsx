import Link from "next/link";
import { notFound } from "next/navigation";

import ReactionBar from "@/components/testimony/ReactionBar";
import Comments from "@/components/testimony/Comments";
import FormattedContent from "@/components/editor/FormattedContent";
import BookmarkButton from "@/components/testimony/BookmarkButton";
import ShareTools from "@/components/testimony/ShareTools";
import SnapshotButton from "@/components/testimony/SnapshotButton";
import ViewTracker from "@/components/testimony/ViewTracker";

import {
  getTestimony,
  getTestimonyCommentCount,
} from "@/lib/content/index";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TestimonyDetailPage({
  params,
}: Props) {
  const { id } = await params;

  const testimony =
    await getTestimony(id);

  if (!testimony) {
    notFound();
  }

  const commentCount =
    await getTestimonyCommentCount(
      testimony.id
    );

  return (
    <main className="bg-slate-50 dark:bg-slate-950">
      <article>
        <ViewTracker
            testimonyId={testimony.id}
          />
        {/* HEADER */}
        <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto w-full max-w-[1050px] px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
            <Link
              href="/testimonies"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-amber-700 dark:text-slate-400 dark:hover:text-amber-400"
            >
              ← Back to testimonies
            </Link>

            <div className="mt-9">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                  {testimony.category}
                </span>

                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Testimony
                </span>
              </div>

              <h1 className="mt-5 max-w-4xl text-3xl font-extrabold leading-tight tracking-[-0.035em] text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
                {testimony.title}
              </h1>

              <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                By {testimony.author}
              </p>
            </div>
          </div>
        </header>

        {/* BODY */}
        <div className="mx-auto grid w-full max-w-[1050px] gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1fr)_230px] lg:px-10">
          <div className="min-w-0">
            {/* FORMATTED TESTIMONY */}
            <div className="single-testimony-content font-serif text-[17px] text-slate-800 sm:text-[19px] dark:text-slate-200">
              <FormattedContent
                content={testimony.content}
              />
            </div>

            {/* REACTION */}
            <div className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-800">
              <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                This testimony encouraged me
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <ReactionBar
                  testimonyId={testimony.id}
                  initialCount={
                    testimony.amenCount
                  }
                />

                <BookmarkButton
                  testimonyId={testimony.id}
                />

                <SnapshotButton
                    testimonyId={testimony.id}
                    title={testimony.title}
                    author={testimony.author}
                    category={testimony.category}
                    content={testimony.content}
                  />
              </div>

              <div className="mt-4">
                <ShareTools
                  testimonyId={testimony.id}
                  title={testimony.title}
                />
              </div>
            </div>

            {/* COMMENTS */}
            <div className="mt-8">
              <Comments
                testimonyId={testimony.id}
                initialCount={commentCount}
              />
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-400">
                  The Witness Path
                </span>

                <p className="mt-3 text-xs leading-6 text-slate-600 dark:text-slate-400">
                  Every testimony carries a
                  reminder that God is still
                  at work.
                </p>

                <Link
                  href="/testimonies/share"
                  className="mt-4 inline-flex text-xs font-bold text-amber-700 transition hover:underline dark:text-amber-400"
                >
                  Share your testimony →
                </Link>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Testimony views
                </p>

                <p className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white">
                  {testimony.views}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}