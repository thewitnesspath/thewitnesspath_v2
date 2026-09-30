"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
    title: "Faith remembered.",
  },
  {
    src: "/images/hero/hero-2.jpg",
    alt: "People gathered together in worship",
    eyebrow: "Shared hope",
    title: "Courage passed on.",
  },
  {
    src: "/images/hero/hero-3.jpg",
    alt: "A peaceful moment of prayer and reflection",
    eyebrow: "A living witness",
    title: "Grace made visible.",
  },
];

const AUTOPLAY_DELAY = 6500;

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  const previousSlide = () => {
    setActiveIndex(
      (current) => (current - 1 + slides.length) % slides.length
    );
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = window.setInterval(nextSlide, AUTOPLAY_DELAY);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = event.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const distance = touchStartX.current - touchEndX.current;
    const minimumSwipeDistance = 50;

    if (distance > minimumSwipeDistance) {
      nextSlide();
    }

    if (distance < -minimumSwipeDistance) {
      previousSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="w-full min-w-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Witness Path featured imagery"
    >
      <div className="relative h-[430px] overflow-hidden rounded-[28px] bg-stone-200 shadow-[0_28px_80px_rgba(28,30,28,0.12)] sm:h-[520px] lg:h-[680px]">
        {slides.map((slide, index) => {
          const active = index === activeIndex;

          return (
            <div
              key={slide.src}
              aria-hidden={!active}
              className={`absolute inset-0 transition-all duration-1000 ease-out ${
                active
                  ? "visible scale-100 opacity-100"
                  : "invisible scale-[1.025] opacity-0"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/70" />

              <div className="absolute bottom-7 left-6 right-6 z-10 max-w-md text-white sm:bottom-10 sm:left-9">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                  {slide.eyebrow}
                </span>

                <h2 className="font-serif text-3xl leading-none tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                  {slide.title}
                </h2>
              </div>
            </div>
          );
        })}

        <div className="absolute left-6 top-6 z-20 flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] text-white/80">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <span className="h-px w-6 bg-white/40" />
          <span>{String(slides.length).padStart(2, "0")}</span>
        </div>

        <div className="absolute right-5 top-5 z-20 flex gap-2">
          <button
            type="button"
            onClick={previousSlide}
            aria-label="Previous image"
            className="flex size-10 items-center justify-center rounded-full border border-white/30 bg-black/15 text-white backdrop-blur-md transition hover:bg-black/40"
          >
            ←
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next image"
            className="flex size-10 items-center justify-center rounded-full border border-white/30 bg-black/15 text-white backdrop-blur-md transition hover:bg-black/40"
          >
            →
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to image ${index + 1}`}
            aria-current={index === activeIndex ? "true" : undefined}
            className="group relative h-[3px] overflow-hidden bg-black/10"
          >
            <span
              className={`absolute inset-0 origin-left bg-[#b88a45] transition-transform duration-500 ${
                index === activeIndex ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}