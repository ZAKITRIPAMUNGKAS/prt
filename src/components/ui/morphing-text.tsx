"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const defaultMorphTime = 1.5;
const defaultCooldownTime = 0.5;

// Hook for autonomous looping through an array of strings
const useAutonomousMorphingText = (texts: string[]) => {
  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(0);
  const timeRef = useRef(new Date());

  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  const setStyles = useCallback(
    (fraction: number) => {
      const [current1, current2] = [text1Ref.current, text2Ref.current];
      if (!current1 || !current2 || !texts || texts.length === 0) return;

      current2.style.filter = `blur(${Math.min(6 / fraction - 6, 50)}px)`;
      current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const invertedFraction = 1 - fraction;
      current1.style.filter = `blur(${Math.min(6 / invertedFraction - 6, 50)}px)`;
      current1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`;

      current1.textContent = texts[textIndexRef.current % texts.length];
      current2.textContent = texts[(textIndexRef.current + 1) % texts.length];
    },
    [texts]
  );

  const doMorph = useCallback(() => {
    morphRef.current -= cooldownRef.current;
    cooldownRef.current = 0;

    let fraction = morphRef.current / defaultMorphTime;

    if (fraction > 1) {
      cooldownRef.current = defaultCooldownTime;
      fraction = 1;
    }

    setStyles(fraction);

    if (fraction === 1) {
      textIndexRef.current++;
    }
  }, [setStyles]);

  const doCooldown = useCallback(() => {
    morphRef.current = 0;
    const [current1, current2] = [text1Ref.current, text2Ref.current];
    if (current1 && current2) {
      current2.style.filter = "none";
      current2.style.opacity = "100%";
      current1.style.filter = "none";
      current1.style.opacity = "0%";
    }
  }, []);

  useEffect(() => {
    if (!texts || texts.length === 0) return;
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const newTime = new Date();
      const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000;
      timeRef.current = newTime;

      cooldownRef.current -= dt;

      if (cooldownRef.current <= 0) doMorph();
      else doCooldown();
    };

    animate();
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [doMorph, doCooldown, texts]);

  return { text1Ref, text2Ref };
};

// Hook for reactive synchronized lyric morphing when `text` changes
const useSyncedMorphingText = (targetText: string) => {
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const prevTextRef = useRef(targetText);

  useEffect(() => {
    const current1 = text1Ref.current;
    const current2 = text2Ref.current;
    if (!current1 || !current2) return;

    const fromText = prevTextRef.current;
    const toText = targetText;
    prevTextRef.current = targetText;

    if (!fromText && toText) {
      // First appearance: set immediately with gentle fade
      current1.textContent = toText;
      current1.style.filter = "none";
      current1.style.opacity = "100%";
      current2.textContent = "";
      current2.style.opacity = "0%";
      return;
    }

    if (fromText === toText) {
      current1.textContent = toText;
      current1.style.filter = "none";
      current1.style.opacity = "100%";
      current2.textContent = "";
      current2.style.opacity = "0%";
      return;
    }

    // Set text contents
    current1.textContent = fromText;
    current2.textContent = toText;

    let startTime: number | null = null;
    const duration = 450; // Snappy 450ms fluid transition
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress < 1) {
        const fraction = Math.max(progress, 0.02);
        current2.style.filter = `blur(${Math.min(6 / fraction - 6, 40)}px)`;
        current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

        const invertedFraction = Math.max(1 - fraction, 0.02);
        current1.style.filter = `blur(${Math.min(6 / invertedFraction - 6, 40)}px)`;
        current1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`;

        frameId = requestAnimationFrame(step);
      } else {
        // Transition finished: solid crisp text
        current1.textContent = toText;
        current1.style.filter = "none";
        current1.style.opacity = "100%";
        current2.textContent = "";
        current2.style.filter = "none";
        current2.style.opacity = "0%";
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [targetText]);

  return { text1Ref, text2Ref };
};

export interface MorphingTextProps {
  className?: string;
  texts?: string[];
  text?: string;
}

const AutonomousTexts: React.FC<{ texts: string[] }> = ({ texts }) => {
  const { text1Ref, text2Ref } = useAutonomousMorphingText(texts);
  return (
    <div className="relative w-full flex items-center justify-center min-h-[4.5rem]">
      <span
        className="absolute inset-x-0 mx-auto w-full text-center leading-snug break-words px-2"
        ref={text1Ref}
      />
      <span
        className="absolute inset-x-0 mx-auto w-full text-center leading-snug break-words px-2"
        ref={text2Ref}
      />
    </div>
  );
};

const SyncedTexts: React.FC<{ text: string }> = ({ text }) => {
  const { text1Ref, text2Ref } = useSyncedMorphingText(text);
  return (
    <div className="relative w-full flex items-center justify-center min-h-[4.5rem]">
      <span
        className="absolute inset-x-0 mx-auto w-full text-center leading-snug break-words px-2"
        ref={text1Ref}
      />
      <span
        className="absolute inset-x-0 mx-auto w-full text-center leading-snug break-words px-2"
        ref={text2Ref}
      />
    </div>
  );
};

export const SvgFilters: React.FC = () => (
  <svg
    id="filters"
    className="fixed pointer-events-none w-0 h-0 opacity-0 -z-50"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <defs>
      <filter id="threshold" colorInterpolationFilters="sRGB">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 35 -10"
        />
      </filter>
    </defs>
  </svg>
);

export const MorphingText: React.FC<MorphingTextProps> = ({
  texts,
  text,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative mx-auto min-h-[5rem] sm:min-h-[6.5rem] w-full max-w-2xl text-center font-sans font-black flex items-center justify-center [filter:url(#threshold)_blur(0.4px)] select-none px-4",
        className
      )}
    >
      {text !== undefined ? (
        <SyncedTexts text={text} />
      ) : texts && texts.length > 0 ? (
        <AutonomousTexts texts={texts} />
      ) : null}
      <SvgFilters />
    </div>
  );
};
