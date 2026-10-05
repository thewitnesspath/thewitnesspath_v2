"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type Slide = {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
};

const slides: Slide[] = [
  {
    src: "/images/hero/hero-1.jpg",
    alt: "A worshipper reflecting during a quiet moment of faith",
    eyebrow: "Stories of grace",
    title: "Different stories. Same faithful God.",
  },
  {
    src: "/images/hero/hero-2.jpg",
    alt: "People gathered together in worship",
    eyebrow: "Shared hope",
    title: "What God has done deserves to be remembered.",
  },
  {
    src: "/images/hero/hero-3.jpg",
    alt: "A peaceful moment of prayer and reflection",
    eyebrow: "A living witness",
    title: "Faith strengthened through every testimony.",
  },
];

const AUTOPLAY_DELAY = 6500;

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] =
    useState(0);

  const [paused, setPaused] =
    useState(false);

  const touchStartX =
    useRef<number | null>(null);

  const touchEndX =
    useRef<number | null>(null);

  const nextSlide =
    useCallback(() => {
      setActiveIndex(
        (current) =>
          (current + 1) %
          slides.length
      );
    }, []);

  const previousSlide =
    useCallback(() => {
      setActiveIndex(
        (current) =>
          (current -
            1 +
            slides.length) %
          slides.length
      );
    }, []);

  useEffect(() => {
    if (paused) return;

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    if (reducedMotion) {
      return;
    }

    const interval =
      window.setInterval(
        nextSlide,
        AUTOPLAY_DELAY
      );

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [nextSlide, paused]);

  function handleTouchStart(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    touchStartX.current =
      event.targetTouches[0]
        .clientX;

    touchEndX.current =
      null;
  }

  function handleTouchMove(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    touchEndX.current =
      event.targetTouches[0]
        .clientX;
  }

  function handleTouchEnd() {
    if (
      touchStartX.current ===
        null ||
      touchEndX.current ===
        null
    ) {
      return;
    }

    const distance =
      touchStartX.current -
      touchEndX.current;

    if (distance > 50) {
      nextSlide();
    }

    if (distance < -50) {
      previousSlide();
    }

    touchStartX.current =
      null;

    touchEndX.current =
      null;
  }

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() =>
        setPaused(true)
      }
      onMouseLeave={() =>
        setPaused(false)
      }
      onFocus={() =>
        setPaused(true)
      }
      onBlur={() =>
        setPaused(false)
      }
      onTouchStart={
        handleTouchStart
      }
      onTouchMove={
        handleTouchMove
      }
      onTouchEnd={
        handleTouchEnd
      }
      aria-roledescription="carousel"
      aria-label="The Witness Path featured imagery"
    >
      {slides.map(
        (slide, index) => {
          const active =
            index ===
            activeIndex;

          return (
            <div
              key={slide.src}
              aria-hidden={
                !active
              }
              className={`absolute inset-0 transition duration-[1200ms] ease-out ${
                active
                  ? "visible scale-100 opacity-100"
                  : "invisible scale-[1.035] opacity-0"
              }`}
            >
              <Image
                src={
                  slide.src
                }
                alt={
                  active
                    ? slide.alt
                    : ""
                }
                fill
                priority={
                  index === 0
                }
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
          );
        }
      )}

      {/* subtle overall image treatment */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020617]/45 via-transparent to-[#020617]/10" />

      {/* decorative witness rings */}
      <div className="pointer-events-none absolute right-[8%] top-[13%] hidden size-[380px] rounded-full border-[52px] border-white/[0.11] lg:block" />

      <div className="pointer-events-none absolute right-[16%] top-[25%] hidden size-[210px] rounded-full border-[35px] border-white/[0.10] lg:block" />

      {/* caption */}
      <div className="absolute bottom-8 right-8 z-10 hidden max-w-[220px] text-right text-white lg:block">
        <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-amber-300">
          {
            slides[
              activeIndex
            ].eyebrow
          }
        </span>

        <p className="mt-2 font-serif text-xl italic leading-tight text-white/90">
          {
            slides[
              activeIndex
            ].title
          }
        </p>
      </div>

      {/* controls */}
      <div className="absolute right-5 top-5 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={
            previousSlide
          }
          aria-label="Previous image"
          className="flex size-9 items-center justify-center rounded-full border border-white/30 bg-[#020617]/25 text-sm text-white backdrop-blur-md transition hover:bg-[#020617]/55"
        >
          ←
        </button>

        <button
          type="button"
          onClick={
            nextSlide
          }
          aria-label="Next image"
          className="flex size-9 items-center justify-center rounded-full border border-white/30 bg-[#020617]/25 text-sm text-white backdrop-blur-md transition hover:bg-[#020617]/55"
        >
          →
        </button>
      </div>

      {/* slide indicator */}
      <div className="absolute bottom-5 left-5 z-20 flex gap-1.5 lg:left-auto lg:right-8">
        {slides.map(
          (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${
                index + 1
              }`}
              onClick={() =>
                setActiveIndex(
                  index
                )
              }
              className={`h-1 rounded-full transition-all duration-500 ${
                index ===
                activeIndex
                  ? "w-8 bg-[#F59E0B]"
                  : "w-3 bg-white/40 hover:bg-white/70"
              }`}
            />
          )
        )}
      </div>
    </div>
  );
}