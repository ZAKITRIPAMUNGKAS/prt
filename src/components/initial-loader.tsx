"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export function InitialLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let hasSeen = false;
    try {
      hasSeen = window.sessionStorage.getItem("app_intro_seen") === "true";
    } catch {
      // sessionStorage unavailable
    }

    const duration = hasSeen ? 0 : reduceMotion ? 400 : 1300;

    const timer = window.setTimeout(() => {
      setIsVisible(false);
      try {
        window.sessionStorage.setItem("app_intro_seen", "true");
      } catch {
        // sessionStorage unavailable
      }
    }, duration);

    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("app_intro_seen", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          aria-live="polite"
          aria-label="Sapaan pembuka portfolio Zaki Tri Pamungkas"
          onClick={handleDismiss}
          title="Klik untuk langsung masuk"
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#101317] px-5 text-white cursor-pointer select-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.02 }}
          transition={{ duration: reduceMotion ? 0.15 : 0.45, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Hardware-accelerated background ambient glow */}
          <motion.div
            aria-hidden="true"
            className="absolute -left-[10%] top-[-10%] size-[22rem] rounded-full bg-[#c5f4e7]/35 blur-3xl will-change-transform"
            animate={reduceMotion ? undefined : { x: [0, 45, 0], y: [0, 35, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute -bottom-[15%] -right-[10%] size-[24rem] rounded-full bg-[#8fa7ff]/40 blur-3xl will-change-transform"
            animate={reduceMotion ? undefined : { x: [0, -45, 0], y: [0, -35, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 size-[16rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f6c5ec]/25 blur-2xl will-change-transform"
            animate={reduceMotion ? undefined : { rotate: [0, 360], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          />

          <motion.section
            className="relative w-full max-w-4xl overflow-hidden rounded-[2.25rem] border border-white/30 bg-white/[0.10] px-7 py-12 text-center shadow-[0_24px_60px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-2xl sm:px-12 sm:py-16"
            initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/85 to-transparent" />
            <p className="mb-2 text-base font-medium tracking-[0.04em] text-white/85 sm:text-lg">
              Hi, namaku
            </p>
            <h1 className="liquid-loader-text bg-[linear-gradient(105deg,#ffffff_8%,#baf6e6_34%,#ffffff_52%,#c7d2ff_72%,#ffffff_92%)] bg-[length:240%_100%] bg-clip-text text-4xl font-semibold tracking-[-0.065em] text-transparent sm:text-6xl md:text-7xl">
              Zaki Tri Pamungkas
            </h1>
            <p className="mt-6 text-sm tracking-[0.08em] text-white/75 sm:text-base">
              Salam kenal ya...
            </p>
            <p className="mt-4 text-xs text-white/40 tracking-wider">
              (klik di mana saja untuk lanjut)
            </p>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
