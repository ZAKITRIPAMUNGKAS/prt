"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PiSparkleFill } from "react-icons/pi";
import { siteConfig } from "@/site.config";

export function InitialPreloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Only show the cinematic preloader once per session
    const hasLoaded = sessionStorage.getItem("app_initial_loaded");
    if (hasLoaded) {
      setLoading(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            sessionStorage.setItem("app_initial_loaded", "true");
          }, 350);
          return 100;
        }
        // Organic acceleration curve
        const step = Math.max(3, Math.floor((100 - prev) * 0.22));
        return Math.min(100, prev + step);
      });
    }, 45);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: {
              duration: 0.75,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
          className="fixed inset-0 z-[9999] flex flex-col justify-between p-6 md:p-12 bg-background text-foreground select-none pointer-events-auto"
        >
          {/* Top Brand Info */}
          <div className="flex items-center justify-between w-full">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex items-center gap-2.5 text-xs md:text-sm tracking-widest uppercase font-mono text-muted-foreground"
            >
              <PiSparkleFill className="text-foreground animate-spin [animation-duration:6s]" size={14} />
              <span>{siteConfig.name}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-xs md:text-sm font-mono text-muted-foreground"
            >
              Surakarta, ID
            </motion.div>
          </div>

          {/* Center Title & Role */}
          <div className="max-w-xl mx-auto w-full text-center flex flex-col items-center gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl md:text-5xl font-medium tracking-tight"
            >
              {siteConfig.name}
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-xs md:text-sm text-muted-foreground tracking-wide"
            >
              {siteConfig.role}
            </motion.p>
          </div>

          {/* Bottom Progress Bar & Percentage */}
          <div className="w-full flex flex-col gap-3">
            <div className="flex justify-between items-baseline text-xs font-mono text-muted-foreground">
              <span className="tracking-wider">MEMUAT ASET & SISTEM</span>
              <span className="text-foreground font-semibold tabular-nums">{progress}%</span>
            </div>
            <div className="w-full h-[2px] bg-muted overflow-hidden rounded-full">
              <motion.div
                className="h-full bg-foreground"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
