import {
  ArrowUpRight,
  MessageCircle,
} from "lucide-react";

export default function WhatsAppSubscribe() {
  const number =
    process.env
      .WHATSAPP_BUSINESS_NUMBER
      ?.replace(/\D/g, "");

  if (!number) {
    return null;
  }

  const message =
    encodeURIComponent(
      "START TESTIMONIES"
    );

  const whatsappUrl =
    `https://wa.me/${number}?text=${message}`;

  return (
    <section
      aria-labelledby="whatsapp-subscribe-title"
      className="
        overflow-hidden
        rounded-[24px]
        border
        border-slate-200
        bg-white
        p-6
        shadow-[0_18px_60px_rgba(15,23,42,0.06)]
        dark:border-white/10
        dark:bg-[#0B1A2A]
        sm:p-8
      "
    >
      <div
        className="
          flex
          flex-col
          gap-6
          md:flex-row
          md:items-center
          md:justify-between
        "
      >
        <div className="max-w-2xl">
          <div
            className="
              mb-4
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-amber-50
              px-3
              py-1.5
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-amber-700
              dark:bg-amber-500/10
              dark:text-amber-400
            "
          >
            <MessageCircle
              size={14}
              aria-hidden="true"
            />

            WhatsApp Testimony Updates
          </div>

          <h2
            id="whatsapp-subscribe-title"
            className="
              font-serif
              text-2xl
              font-semibold
              tracking-[-0.03em]
              text-[#07162E]
              dark:text-white
              sm:text-3xl
            "
          >
            Let testimonies meet you
            where you already are.
          </h2>

          <p
            className="
              mt-3
              max-w-xl
              text-sm
              leading-7
              text-slate-600
              dark:text-slate-400
              sm:text-[15px]
            "
          >
            Receive a WhatsApp message
            whenever a new testimony is
            published on The Witness
            Path.
          </p>

          <p
            className="
              mt-3
              text-xs
              leading-5
              text-slate-500
              dark:text-slate-500
            "
          >
            You can reply STOP at any
            time to unsubscribe.
          </p>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex
            shrink-0
            items-center
            justify-center
            gap-2
            rounded-full
            bg-[#07162E]
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:-translate-y-0.5
            hover:bg-[#102747]
            focus:outline-none
            focus:ring-2
            focus:ring-amber-500
            focus:ring-offset-2
            dark:bg-amber-500
            dark:text-[#07162E]
            dark:hover:bg-amber-400
            dark:focus:ring-offset-[#0B1A2A]
          "
        >
          Get testimonies on WhatsApp

          <ArrowUpRight
            size={16}
            aria-hidden="true"
          />
        </a>
      </div>
    </section>
  );
}