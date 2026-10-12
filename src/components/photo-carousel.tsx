"use client";

import {
  ReactNode,
  useState,
  useCallback,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import { getPrefersReducedMotion } from "@/lib/motion";

interface CarouselProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  autoplayDelay?: number;
}

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => {
    mq.removeEventListener("change", callback);
  };
}

/**
 * Carousel component displays a carousel of images with an interactive progress indicator.
 *
 * - Fills 0% to 100% over autoplayDelay
 * - Pauses on hover, touch, and background tab
 * - Respects prefers-reduced-motion
 * - Includes accessible SR pause/play control
 */
const Carousel = ({
  children,
  className = "",
  containerClassName = "",
  autoplayDelay = 6000,
}: CarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);

  const isReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getPrefersReducedMotion,
    () => false
  );

  const isPaused =
    isHovered || isTouching || isTabHidden || isManuallyPaused || isReducedMotion;

  const progressFillRef = useRef<HTMLDivElement>(null);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const resetProgress = useCallback(() => {
    elapsedRef.current = 0;
    if (progressFillRef.current) {
      progressFillRef.current.style.width = "0%";
    }
  }, []);

  const scrollTo = useCallback(
    (index: number) => {
      resetProgress();
      emblaApi?.scrollTo(index);
    },
    [emblaApi, resetProgress]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      resetProgress();
    };

    const onInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      setSelectedIndex(emblaApi.selectedScrollSnap());
      resetProgress();
    };

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onInit);

    const timer = setTimeout(onInit, 0);

    return () => {
      clearTimeout(timer);
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onInit);
    };
  }, [emblaApi, resetProgress]);

  // Tab visibility listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabHidden(document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Synchronized Autoplay & Progress RAF Loop (direct DOM manipulation to avoid re-renders)
  useEffect(() => {
    if (isReducedMotion || scrollSnaps.length <= 1) {
      if (progressFillRef.current) {
        progressFillRef.current.style.width = "0%";
      }
      return;
    }

    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }

      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (!isPaused) {
        elapsedRef.current += delta;
        const currentPct = Math.min(
          100,
          (elapsedRef.current / autoplayDelay) * 100
        );

        if (progressFillRef.current) {
          progressFillRef.current.style.width = `${currentPct}%`;
        }

        if (elapsedRef.current >= autoplayDelay) {
          elapsedRef.current = 0;
          if (progressFillRef.current) {
            progressFillRef.current.style.width = "0%";
          }
          emblaApi?.scrollNext();
        }
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [autoplayDelay, emblaApi, isPaused, isReducedMotion, scrollSnaps.length]);

  return (
    <div
      className={`overflow-hidden relative ${className}`}
      ref={emblaRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsTouching(true)}
      onTouchEnd={() => setIsTouching(false)}
      onTouchCancel={() => setIsTouching(false)}
    >
      {/* Screen-reader / Keyboard Accessible Play/Pause Button */}
      <button
        type="button"
        onClick={() => setIsManuallyPaused((prev) => !prev)}
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-30 bg-black/75 backdrop-blur-sm text-white px-3 py-1.5 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label={isManuallyPaused ? "Resume autoplay" : "Pause autoplay"}
      >
        {isManuallyPaused ? "Resume autoplay" : "Pause autoplay"}
      </button>

      <div className={`flex ${containerClassName}`}>{children}</div>

      {/* Navigation Buttons */}
      <div className="hidden lg:flex absolute inset-y-0 left-0 right-0 items-center justify-between px-8 pointer-events-none z-20">
        <button
          className="w-10 h-10 bg-black/15 backdrop-blur-sm flex items-center justify-center pointer-events-auto text-white rounded-md transition-opacity hover:bg-black/30"
          aria-label="Previous slide"
          onClick={() => {
            resetProgress();
            emblaApi?.scrollPrev();
          }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          className="w-10 h-10 bg-black/15 backdrop-blur-sm flex items-center justify-center pointer-events-auto text-white rounded-md transition-opacity hover:bg-black/30"
          aria-label="Next slide"
          onClick={() => {
            resetProgress();
            emblaApi?.scrollNext();
          }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/15 backdrop-blur-sm px-3 py-1 rounded-full z-20">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
            aria-label={`Slide ${index + 1}`}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>

      {/* 2px Progress Bar at bottom of carousel */}
      {!isReducedMotion && scrollSnaps.length > 1 && (
        <div
          className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white/20 z-20 pointer-events-none overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Carousel autoplay progress"
        >
          <div
            ref={progressFillRef}
            className="h-full bg-white transition-[width] ease-linear duration-75"
            style={{ width: "0%" }}
          />
        </div>
      )}
    </div>
  );
};

export default Carousel;
