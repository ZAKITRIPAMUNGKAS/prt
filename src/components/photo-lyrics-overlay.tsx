"use client";

import React, { useMemo } from "react";
import { useAudioStore, useCurrentTrack } from "@/stores/use-audio-store";
import { parseLrc } from "@/config/music";
import { MorphingText } from "@/components/ui/morphing-text";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export function PhotoLyricsOverlay({ className }: { className?: string }) {
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const showLyrics = useAudioStore((s) => s.showLyrics);
  const currentTrack = useCurrentTrack();
  const lyricsRaw = currentTrack?.lyrics;

  // Parse lyrics of current track
  const lyricsTexts = useMemo(() => {
    if (!lyricsRaw) return [];
    const parsed = parseLrc(lyricsRaw);
    const cleanLines = parsed
      .map((l) => l.text.trim())
      .filter((t) => t && !t.startsWith("(") && !t.endsWith("..."));
    return cleanLines.length > 0
      ? cleanLines
      : parsed.map((l) => l.text.trim()).filter(Boolean);
  }, [lyricsRaw]);

  if (!showLyrics || lyricsTexts.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center p-6 md:p-10 select-none overflow-hidden",
        className
      )}
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg flex flex-col items-center justify-center text-center"
        >
          {/* Subtle Spotify-style mini badge */}
          <div className="mb-3 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/80 text-[10px] sm:text-xs font-medium flex items-center gap-2 shadow-lg">
            <span
              className={cn(
                "size-1.5 rounded-full shrink-0",
                isPlaying ? "bg-emerald-400 animate-pulse" : "bg-white/40"
              )}
            />
            <span className="truncate max-w-[200px]">
              {currentTrack?.title} • {currentTrack?.artist}
            </span>
          </div>

          {/* Morphing Lyrics in center of photo */}
          <div className="w-full flex items-center justify-center drop-shadow-[0_8px_24px_rgba(0,0,0,0.9)] text-white">
            <MorphingText
              texts={lyricsTexts}
              className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-black tracking-tight"
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
