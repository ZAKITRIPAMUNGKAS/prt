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

      current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const invertedFraction = 1 - fraction;
      current1.style.filter = `blur(${Math.min(8 / invertedFraction - 8, 100)}px)`;
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
      // Initial appearance
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

    current1.textContent = fromText;
    current2.textContent = toText;

    let startTime: number | null = null;
    const duration = 800; // 0.8s fluid transition
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress < 1) {
        const fraction = Math.max(progress, 0.01);
        current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

        const invertedFraction = Math.max(1 - fraction, 0.01);
        current1.style.filter = `blur(${Math.min(8 / invertedFraction - 8, 100)}px)`;
        current1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`;

        frameId = requestAnimationFrame(step);
      } else {
        // Morph complete: clear blur and keep toText solid
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
    <>
      <span
        className="absolute inset-x-0 top-0 m-auto inline-block w-full text-center"
        ref={text1Ref}
      />
      <span
        className="absolute inset-x-0 top-0 m-auto inline-block w-full text-center"
        ref={text2Ref}
      />
    </>
  );
};

const SyncedTexts: React.FC<{ text: string }> = ({ text }) => {
  const { text1Ref, text2Ref } = useSyncedMorphingText(text);
  return (
    <>
      <span
        className="absolute inset-x-0 top-0 m-auto inline-block w-full text-center"
        ref={text1Ref}
      />
      <span
        className="absolute inset-x-0 top-0 m-auto inline-block w-full text-center"
        ref={text2Ref}
      />
    </>
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
      <filter id="threshold">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
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
        "relative mx-auto h-20 sm:h-28 w-full max-w-screen-md text-center font-sans text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-black leading-tight [filter:url(#threshold)_blur(0.6px)] select-none",
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
