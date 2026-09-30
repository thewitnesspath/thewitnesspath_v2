import BlogList from "@/components/blog/BlogList";

import {
  listBlogPosts,
} from "@/lib/content/index";

export default async function BlogPage() {
  const posts =
    await listBlogPosts();

  return (
    <main className="min-h-screen bg-primary text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-accent">
            The Witness Blog
          </span>

          <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
            Biblical truth for everyday faith.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            Teachings, reflections and
            encouragement for walking
            faithfully with God.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1100px] px-4 py-10 sm:px-6 lg:px-10">
        <BlogList posts={posts} />
      </section>
    </main>
  );
}