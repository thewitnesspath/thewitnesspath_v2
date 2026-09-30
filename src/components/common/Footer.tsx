import Link from "next/link";

const footerLinks = [
  { label: "Testimonies", href: "/testimonies" },
  { label: "Blog", href: "/blog" },
  { label: "Prayer", href: "/prayer" },
  { label: "About", href: "/about" },
];

export default function Footer() {
  return (
    <footer className="bg-[#171e19] text-white">
      <div className="mx-auto w-full max-w-[1320px] px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#cba66b]">
              The Witness Path
            </span>

            <h2 className="mt-4 max-w-xl font-serif text-3xl leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              Stories remembered.
              <br />
              Faith strengthened.
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/55">
              A place to preserve testimonies of God&apos;s faithfulness and
              allow those stories to become encouragement for others.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-2">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                Explore
              </span>

              <div className="mt-4 grid gap-3">
                {footerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="w-fit text-sm text-white/65 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                Take part
              </span>

              <div className="mt-4 grid gap-3">
                <Link
                  href="/testimonies/share"
                  className="w-fit text-sm text-white/65 transition hover:text-white"
                >
                  Share testimony
                </Link>

                <Link
                  href="/prayer"
                  className="w-fit text-sm text-white/65 transition hover:text-white"
                >
                  Prayer request
                </Link>

                <Link
                  href="/auth/login"
                  className="w-fit text-sm text-white/65 transition hover:text-white"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-[11px] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} The Witness Path. All rights reserved.
          </p>

          <p>Witness His grace, strengthen your faith.</p>
        </div>
      </div>
    </footer>
  );
}