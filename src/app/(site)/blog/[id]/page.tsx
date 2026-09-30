import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  Eye,
} from "lucide-react";

import BlogLikeButton from "@/components/blog/BlogLikeButton";
import BlogBookmarkButton from "@/components/blog/BlogBookmarkButton";
import BlogShareTools from "@/components/blog/BlogShareTools";
import BlogViewTracker from "@/components/blog/BlogViewTracker";
import BlogComments from "@/components/blog/BlogComments";
import BlogSnapshotButton from "@/components/blog/BlogSnapshotButton";

import FormattedContent from "@/components/editor/FormattedContent";

import {
  getBlogPost,
  getBlogCommentCount,
} from "@/lib/content/index";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BlogArticlePage({
  params,
}: Props) {
  const { slug } =
    await params;

  const post =
    await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const commentCount =
    await getBlogCommentCount(
      post.id
    );

  return (
    <main className="min-h-screen bg-primary text-white">
      <BlogViewTracker
        postId={post.id}
      />

      {/* HEADER */}
      <header className="border-b border-white/10">
        <div className="mx-auto w-full max-w-[1000px] px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-accent"
          >
            <ArrowLeft
              size={14}
            />

            Back to Blog
          </Link>

          <div className="mt-8">
            <span className="inline-flex rounded-lg border border-accent/20 bg-accent/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-accent">
              {post.category}
            </span>

            <h1 className="mt-5 max-w-4xl text-3xl font-extrabold leading-[1.08] tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
              <span>
                By {post.author}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Eye size={13} />

                {post.views} views
              </span>

              {post.createdAt && (
                <span>
                  {new Intl.DateTimeFormat(
                    "en",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  ).format(
                    new Date(
                      post.createdAt
                    )
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <article className="mx-auto w-full max-w-[1000px] px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="min-w-0">
            <div className="font-serif text-[17px] text-slate-200 sm:text-[19px]">
              <FormattedContent
                content={post.content}
              />
            </div>

            {/* ARTICLE ACTIONS */}
            <div className="mt-10 border-t border-white/10 pt-6">
              <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Article actions
              </span>

              <div className="flex flex-wrap gap-2">
                <BlogLikeButton
                  postId={post.id}
                  initialCount={
                    post.likes
                  }
                />

                <BlogBookmarkButton
                  postId={post.id}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <BlogLikeButton
                  postId={post.id}
                  initialCount={post.likes}
                />

                <BlogBookmarkButton
                  postId={post.id}
                />

                <BlogSnapshotButton
                  postId={post.id}
                  title={post.title}
                  author={post.author}
                  category={post.category}
                  content={post.content}
                />
              </div>

              <div className="mt-4">
                <BlogShareTools
                  slug={
                    post.slug ||
                    post.id
                  }
                  title={post.title}
                />
              </div>
            </div>

            {/* COMMENTS */}
            <div className="mt-8">
              <BlogComments
                postId={post.id}
                initialCount={
                  commentCount
                }
              />
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="rounded-2xl border border-white/10 bg-secondary p-5">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-accent">
                  The Witness Path
                </span>

                <p className="mt-3 text-xs leading-6 text-slate-400">
                  Biblical truth,
                  reflection and
                  encouragement for
                  everyday faith.
                </p>

                <Link
                  href="/blog"
                  className="mt-4 inline-flex text-xs font-bold text-accent hover:underline"
                >
                  Explore more teachings →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}