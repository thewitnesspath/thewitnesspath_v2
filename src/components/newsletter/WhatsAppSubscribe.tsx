import {
  ArrowUpRight,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

export default function WhatsAppSubscribe() {
  const rawNumber =
    process.env
      .WHATSAPP_BUSINESS_NUMBER;

  if (!rawNumber) {
    return null;
  }

  const phone =
    rawNumber.replace(
      /\D/g,
      ""
    );

  const message =
    encodeURIComponent(
      "START TESTIMONIES"
    );

  const subscribeUrl =
    `https://wa.me/${phone}?text=${message}`;

  return (
    <section className="overflow-hidden rounded-[20px] border border-[#07162E]/10 bg-[#07162E] text-white dark:border-white/10 dark:bg-[#0B1A2A]">
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center lg:p-7">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#F59E0B]/10 text-[#F59E0B]">
            <MessageCircle
              size={18}
            />
          </div>

          <div>
            <span className="text-[8px] font-extrabold uppercase tracking-[0.19em] text-[#F59E0B]">
              Testimony alerts
            </span>

            <h3 className="mt-2 font-serif text-2xl leading-tight tracking-[-0.035em] sm:text-3xl">
              Get new testimonies
              on WhatsApp.
            </h3>

            <p className="mt-3 max-w-xl text-[11px] leading-6 text-white/55">
              Be notified when a
              new testimony of
              God&apos;s
              faithfulness is
              published on The
              Witness Path.
            </p>

            <div className="mt-3 flex items-center gap-2 text-[9px] text-white/40">
              <ShieldCheck
                size={12}
                className="text-[#F59E0B]"
              />

              <span>
                You can reply
                STOP at any time.
              </span>
            </div>
          </div>
        </div>

        <a
          href={
            subscribeUrl
          }
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-6 text-[10px] font-extrabold text-[#07162E] transition hover:-translate-y-0.5 hover:bg-amber-400 lg:w-auto"
        >
          Notify Me on WhatsApp

          <ArrowUpRight
            size={13}
            className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      </div>
    </section>
  );
}