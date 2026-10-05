import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  ArrowUpRight,
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
  listBlogPosts,
} from "@/lib/content/index";

import {
  getBlogImage,
} from "@/lib/content-images";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(
  value?: string | null
) {
  if (!value) return "";

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(date);
}

export default async function BlogArticlePage({
  params,
}: Props) {
  const { slug } =
    await params;

  const post =
    await getBlogPost(
      slug
    );

  if (!post) {
    notFound();
  }

  const [
    commentCount,
    allPosts,
  ] =
    await Promise.all([
      getBlogCommentCount(
        post.id
      ),

      listBlogPosts(),
    ]);

  /*
   * Prefer articles in the same
   * category first.
   */
  const relatedPosts =
    allPosts
      .filter(
        (item) =>
          item.id !==
            post.id &&
          item.category ===
            post.category
      )
      .slice(0, 3);

  /*
   * If fewer than 3 posts exist
   * in this category, fill the
   * remaining slots with other
   * recent articles.
   */
  if (
    relatedPosts.length <
    3
  ) {
    const existingIds =
      new Set(
        relatedPosts.map(
          (item) =>
            item.id
        )
      );

    const extras =
      allPosts.filter(
        (item) =>
          item.id !==
            post.id &&
          !existingIds.has(
            item.id
          )
      );

    relatedPosts.push(
      ...extras.slice(
        0,
        3 -
          relatedPosts.length
      )
    );
  }

  const heroImage =
    getBlogImage(
      post.category
    );

  const date =
    formatDate(
      post.createdAt
    );

  return (
    <main className="min-h-screen bg-[#FFFDF8] text-[#07162E] transition-colors duration-300 dark:bg-[#06111F] dark:text-white">
      <BlogViewTracker
        postId={post.id}
      />

      {/* =================================================
          HERO
      ================================================= */}

      <section className="px-3 pb-4 pt-[92px] sm:px-5 lg:px-7">
        <div className="relative mx-auto min-h-[560px] w-full max-w-[1420px] overflow-hidden rounded-[24px] border border-[#07162E]/10 bg-[#07162E] shadow-[0_24px_80px_rgba(7,22,46,0.15)] dark:border-white/10 dark:shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
          <Image
            src={heroImage}
            alt={`${post.category || "Blog"} article`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          {/* DARK CINEMATIC TREATMENT */}

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,14,27,0.96)_0%,rgba(4,14,27,0.82)_48%,rgba(4,14,27,0.38)_100%)]" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#06111F]/65 via-transparent to-[#06111F]/10" />

          {/* CONTENT */}

          <div className="relative z-10 flex min-h-[560px] flex-col justify-between px-5 py-8 text-white sm:px-8 sm:py-10 lg:px-12 lg:py-12">
            <Link
              href="/blog"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-[#06111F]/35 px-4 py-2.5 text-[10px] font-bold text-white/80 backdrop-blur-md transition hover:border-[#F59E0B] hover:text-[#F59E0B]"
            >
              <ArrowLeft
                size={13}
              />

              Back to Blog
            </Link>

            <div className="max-w-[920px]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[#F59E0B]/65 bg-[#06111F]/55 px-3 py-1.5 text-[8px] font-extrabold uppercase tracking-[0.18em] text-[#F59E0B] backdrop-blur-md">
                  {post.category ||
                    "Teaching"}
                </span>

                {date && (
                  <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/55">
                    {date}
                  </span>
                )}
              </div>

              <h1 className="mt-5 max-w-[900px] font-serif text-[clamp(2.8rem,6vw,6rem)] leading-[0.94] tracking-[-0.055em]">
                {post.title}
              </h1>

              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/15 pt-5 text-[10px] text-white/60">
                <div>
                  <span className="block text-[8px] font-bold uppercase tracking-[0.17em] text-white/35">
                    Written by
                  </span>

                  <strong className="mt-1 block text-[11px] text-white">
                    {post.author ||
                      "The Witness Team"}
                  </strong>
                </div>

                <span className="hidden h-8 w-px bg-white/15 sm:block" />

                <span className="inline-flex items-center gap-1.5">
                  <Eye
                    size={13}
                    className="text-[#F59E0B]"
                  />

                  {post.views ??
                    0}{" "}
                  views
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          ARTICLE
      ================================================= */}

      <article className="mx-auto w-full max-w-[1260px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,760px)_280px] lg:justify-between xl:grid-cols-[minmax(0,800px)_300px]">
          {/* =============================================
              ARTICLE BODY
          ============================================= */}

          <div className="min-w-0">
            <div
              className="
                font-serif
                text-[17px]
                leading-[1.9]
                text-[#26354A]

                sm:text-[18px]
                sm:leading-[1.95]

                dark:text-slate-300

                [&_p]:mb-7

                [&_h2]:mb-4
                [&_h2]:mt-12
                [&_h2]:font-serif
                [&_h2]:text-3xl
                [&_h2]:leading-tight
                [&_h2]:tracking-[-0.035em]
                [&_h2]:text-[#07162E]
                dark:[&_h2]:text-white

                [&_h3]:mb-3
                [&_h3]:mt-9
                [&_h3]:text-xl
                [&_h3]:font-bold
                [&_h3]:text-[#07162E]
                dark:[&_h3]:text-white

                [&_strong]:font-bold
                [&_strong]:text-[#07162E]
                dark:[&_strong]:text-white

                [&_blockquote]:my-10
                [&_blockquote]:border-l-[3px]
                [&_blockquote]:border-[#F59E0B]
                [&_blockquote]:bg-[#F59E0B]/5
                [&_blockquote]:px-5
                [&_blockquote]:py-5
                [&_blockquote]:font-serif
                [&_blockquote]:text-xl
                [&_blockquote]:italic
                [&_blockquote]:leading-8
                dark:[&_blockquote]:bg-[#F59E0B]/[0.07]

                [&_a]:font-semibold
                [&_a]:text-[#D97706]
                [&_a]:underline
                [&_a]:underline-offset-4
                dark:[&_a]:text-[#F59E0B]

                [&_ul]:my-7
                [&_ul]:space-y-3
                [&_ul]:pl-5

                [&_ol]:my-7
                [&_ol]:space-y-3
                [&_ol]:pl-5
              "
            >
              <FormattedContent
                content={
                  post.content
                }
              />
            </div>

            {/* ==========================================
                ARTICLE ACTIONS
            ========================================== */}

            <section className="mt-14 border-y border-[#07162E]/10 py-7 dark:border-white/10">
              <div className="flex flex-col gap-5">
                <div>
                  <span className="text-[9px] font-extrabold uppercase tracking-[0.19em] text-[#D97706] dark:text-[#F59E0B]">
                    Enjoyed this
                    article?
                  </span>

                  <h2 className="mt-2 font-serif text-2xl tracking-[-0.035em] text-[#07162E] dark:text-white">
                    Carry the word
                    forward.
                  </h2>
                </div>

                {/* PRIMARY ACTIONS */}

                <div className="flex flex-wrap gap-2">
                  <BlogLikeButton
                    postId={
                      post.id
                    }
                    initialCount={
                      post.likes ??
                      0
                    }
                  />

                  <BlogBookmarkButton
                    postId={
                      post.id
                    }
                  />

                  <BlogSnapshotButton
                    postId={
                      post.id
                    }
                    title={
                      post.title
                    }
                    author={
                      post.author ??
                      "The Witness Team"
                    }
                    category={
                      post.category ??
                      "Teaching"
                    }
                    content={
                      post.content
                    }
                  />
                </div>

                {/* SHARE */}

                <div className="border-t border-[#07162E]/10 pt-5 dark:border-white/10">
                  <span className="mb-3 block text-[9px] font-bold uppercase tracking-[0.17em] text-slate-400 dark:text-slate-500">
                    Share article
                  </span>

                  <BlogShareTools
                    slug={
                      post.slug ||
                      post.id
                    }
                    title={
                      post.title
                    }
                  />
                </div>
              </div>
            </section>

            {/* ==========================================
                COMMENTS
            ========================================== */}

            <div className="mt-8">
              <BlogComments
                postId={
                  post.id
                }
                initialCount={
                  commentCount
                }
              />
            </div>
          </div>

          {/* =============================================
              SIDEBAR
          ============================================= */}

          <aside className="hidden lg:block">
            <div className="sticky top-[110px] space-y-4">
              {/* WITNESS PATH */}

              <div className="overflow-hidden rounded-[20px] border border-[#07162E]/10 bg-white shadow-[0_12px_35px_rgba(7,22,46,0.05)] dark:border-white/10 dark:bg-[#0B1A2A] dark:shadow-none">
                <div className="relative h-[150px] overflow-hidden">
                  <Image
                    src={heroImage}
                    alt=""
                    fill
                    sizes="300px"
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-[#06111F]/45" />
                </div>

                <div className="p-5">
                  <span className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-[#D97706] dark:text-[#F59E0B]">
                    The Witness
                    Path
                  </span>

                  <h3 className="mt-3 font-serif text-2xl leading-tight tracking-[-0.035em] text-[#07162E] dark:text-white">
                    Truth for the
                    journey.
                  </h3>

                  <p className="mt-3 text-[12px] leading-6 text-slate-500 dark:text-slate-400">
                    Biblical
                    teaching,
                    reflection and
                    encouragement
                    for everyday
                    faith.
                  </p>

                  <Link
                    href="/blog"
                    className="mt-5 inline-flex items-center gap-2 text-[10px] font-extrabold text-[#D97706] dark:text-[#F59E0B]"
                  >
                    Explore more
                    teachings

                    <ArrowUpRight
                      size={13}
                    />
                  </Link>
                </div>
              </div>

              {/* TESTIMONY CTA */}

              <div className="rounded-[20px] bg-[#07162E] p-6 text-white dark:border dark:border-white/10 dark:bg-[#0E1628]">
                <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#F59E0B]">
                  Your story
                  matters
                </span>

                <h3 className="mt-3 font-serif text-2xl leading-tight tracking-[-0.04em]">
                  Has God done
                  something worth
                  remembering?
                </h3>

                <p className="mt-3 text-[11px] leading-5 text-white/55">
                  Share your
                  testimony and
                  strengthen
                  someone still
                  waiting.
                </p>

                <Link
                  href="/testimonies/share"
                  className="mt-5 inline-flex rounded-xl bg-[#F59E0B] px-4 py-2.5 text-[10px] font-extrabold text-[#07162E]"
                >
                  Share a
                  Testimony
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </article>

      {/* =================================================
          RELATED ARTICLES
      ================================================= */}

      {relatedPosts.length >
        0 && (
        <section className="border-t border-[#07162E]/10 py-14 sm:py-16 lg:py-20 dark:border-white/10">
          <div className="mx-auto max-w-[1260px] px-4 sm:px-6 lg:px-8">
            <div className="mb-7 flex items-end justify-between gap-5">
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#D97706] dark:text-[#F59E0B]">
                  Continue reading
                </p>

                <h2 className="mt-2 font-serif text-3xl tracking-[-0.04em] text-[#07162E] sm:text-4xl dark:text-white">
                  Related Articles
                </h2>
              </div>

              <Link
                href="/blog"
                className="hidden text-[11px] font-bold text-[#D97706] sm:inline-flex dark:text-[#F59E0B]"
              >
                View all articles →
              </Link>
            </div>

            {/* MOBILE CAROUSEL / DESKTOP GRID */}

            <div
              className="
                -mx-4
                flex
                snap-x
                snap-mandatory
                gap-4
                overflow-x-auto
                px-4
                pb-4
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden

                sm:-mx-6
                sm:px-6

                md:mx-0
                md:grid
                md:grid-cols-3
                md:overflow-visible
                md:px-0
                md:pb-0
              "
            >
              {relatedPosts.map(
                (
                  related
                ) => (
                  <Link
                    key={
                      related.id
                    }
                    href={`/blog/${
                      related.slug ||
                      related.id
                    }`}
                    className="group min-w-[84%] snap-start overflow-hidden rounded-[18px] border border-[#07162E]/10 bg-white transition hover:-translate-y-1 hover:border-[#F59E0B]/40 sm:min-w-[65%] md:min-w-0 dark:border-white/10 dark:bg-[#0B1A2A]"
                  >
                    <div className="relative h-[180px] overflow-hidden">
                      <Image
                        src={getBlogImage(
                          related.category
                        )}
                        alt=""
                        fill
                        sizes="(max-width: 767px) 84vw, 33vw"
                        className="object-cover transition duration-700 group-hover:scale-[1.045]"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#06111F]/55 via-transparent to-transparent" />

                      <span className="absolute bottom-4 left-4 rounded-full border border-[#F59E0B]/60 bg-[#06111F]/65 px-3 py-1 text-[8px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur">
                        {related.category ||
                          "Teaching"}
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="font-serif text-[24px] leading-[1.07] tracking-[-0.035em] text-[#07162E] transition group-hover:text-[#D97706] dark:text-white dark:group-hover:text-[#F59E0B]">
                        {related.title}
                      </h3>

                      <p className="mt-3 line-clamp-2 text-[12px] leading-5 text-slate-500 dark:text-slate-400">
                        {related.content}
                      </p>

                      <div className="mt-5 flex items-center justify-between border-t border-[#07162E]/10 pt-4 dark:border-white/10">
                        <span className="text-[10px] font-bold text-[#07162E] dark:text-white">
                          Read article
                        </span>

                        <ArrowUpRight
                          size={14}
                          className="transition group-hover:text-[#D97706] dark:group-hover:text-[#F59E0B]"
                        />
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>

            <Link
              href="/blog"
              className="mt-5 inline-flex text-[11px] font-bold text-[#D97706] sm:hidden dark:text-[#F59E0B]"
            >
              View all articles →
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}