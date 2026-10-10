"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  ArrowUpRight,
  MessageCircle,
  X,
} from "lucide-react";

type Props = {
  phoneNumber: string;
};

const STORAGE_KEY =
  "witnesspath_whatsapp_modal_dismissed";

const SUBSCRIBED_KEY =
  "witnesspath_whatsapp_subscribed";

const SEVEN_DAYS =
  7 * 24 * 60 * 60 * 1000;

export default function WhatsAppSubscribeModal({
  phoneNumber,
}: Props) {
  const [
    open,
    setOpen,
  ] = useState(false);

  useEffect(() => {
    if (!phoneNumber) {
      return;
    }

    /*
     * If this browser has already
     * subscribed, never show again.
     */
    const alreadySubscribed =
      localStorage.getItem(
        SUBSCRIBED_KEY,
      ) === "true";

    if (
      alreadySubscribed
    ) {
      return;
    }

    /*
     * If they only dismissed the modal,
     * hide it for 7 days.
     */
    const stored =
      localStorage.getItem(
        STORAGE_KEY,
      );

    if (stored) {
      const dismissedAt =
        Number(stored);

      const stillHidden =
        Date.now() -
          dismissedAt <
        SEVEN_DAYS;

      if (
        stillHidden
      ) {
        return;
      }
    }

    /*
     * Show after 4 seconds.
     */
    const timer =
      window.setTimeout(
        () => {
          setOpen(true);
        },
        4000,
      );

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [phoneNumber]);

  function closeModal() {
    /*
     * They didn't subscribe.
     * Show again after 7 days.
     */
    localStorage.setItem(
      STORAGE_KEY,
      String(
        Date.now(),
      ),
    );

    setOpen(false);
  }

  function handleSubscribe() {
    /*
     * They clicked through to subscribe.
     * Don't show the modal again
     * on this browser.
     */
    localStorage.setItem(
      SUBSCRIBED_KEY,
      "true",
    );

    localStorage.setItem(
      STORAGE_KEY,
      String(
        Date.now(),
      ),
    );

    setOpen(false);
  }

  if (
    !open ||
    !phoneNumber
  ) {
    return null;
  }

  const cleanNumber =
    phoneNumber.replace(
      /\D/g,
      "",
    );

  const message =
    encodeURIComponent(
      "START TESTIMONIES",
    );

  const whatsappUrl =
    `https://wa.me/${cleanNumber}?text=${message}`;

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-end
        justify-center
        bg-[#020617]/55
        p-4
        backdrop-blur-[3px]
        sm:items-center
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsapp-modal-title"
      onClick={
        closeModal
      }
    >
      <div
        className="
          relative
          w-full
          max-w-[520px]
          overflow-hidden
          rounded-[26px]
          border
          border-white/10
          bg-[#07162E]
          p-6
          text-white
          shadow-[0_30px_100px_rgba(0,0,0,0.35)]
          sm:p-8
          dark:bg-[#0B1A2A]
        "
        onClick={(
          event,
        ) => {
          event.stopPropagation();
        }}
      >
        <div
          className="
            pointer-events-none
            absolute
            -right-24
            -top-24
            size-52
            rounded-full
            bg-[#F59E0B]/15
            blur-3xl
          "
        />

        <button
          type="button"
          onClick={
            closeModal
          }
          aria-label="Close WhatsApp updates"
          className="
            absolute
            right-4
            top-4
            z-10
            flex
            size-9
            items-center
            justify-center
            rounded-full
            border
            border-white/10
            bg-white/5
            text-white/65
            transition
            hover:bg-white/10
            hover:text-white
          "
        >
          <X
            size={17}
          />
        </button>

        <div className="relative">
          <div
            className="
              mb-6
              flex
              size-12
              items-center
              justify-center
              rounded-2xl
              bg-[#F59E0B]
              text-[#07162E]
            "
          >
            <MessageCircle
              size={23}
            />
          </div>

          <p
            className="
              text-[9px]
              font-extrabold
              uppercase
              tracking-[0.22em]
              text-[#F59E0B]
            "
          >
            Testimony Updates
          </p>

          <h2
            id="whatsapp-modal-title"
            className="
              mt-3
              max-w-md
              font-serif
              text-3xl
              leading-[1.05]
              tracking-[-0.04em]
              sm:text-4xl
            "
          >
            Don&apos;t miss the
            next testimony.
          </h2>

          <p
            className="
              mt-4
              max-w-md
              text-sm
              leading-7
              text-white/65
            "
          >
            Receive a WhatsApp
            message whenever a
            new testimony is
            published on The
            Witness Path.
          </p>

          <a
            href={
              whatsappUrl
            }
            target="_blank"
            rel="noopener noreferrer"
            onClick={
              handleSubscribe
            }
            className="
              mt-7
              inline-flex
              min-h-12
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#F59E0B]
              px-5
              text-sm
              font-extrabold
              text-[#07162E]
              transition
              hover:-translate-y-0.5
              hover:bg-amber-400
              sm:w-auto
            "
          >
            Get testimonies on
            WhatsApp

            <ArrowUpRight
              size={17}
            />
          </a>

          <p
            className="
              mt-4
              text-[10px]
              leading-5
              text-white/40
            "
          >
            WhatsApp will open
            with your subscription
            message ready. Simply
            press Send. Reply STOP
            anytime to unsubscribe.
          </p>
        </div>
      </div>
    </div>
  );
}