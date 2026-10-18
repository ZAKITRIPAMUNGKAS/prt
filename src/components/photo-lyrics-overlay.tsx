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
  const currentTime = useAudioStore((s) => s.currentTime);
  const currentTrack = useCurrentTrack();
  const lyricsRaw = currentTrack?.lyrics;

  // Parse lyrics of current track
  const parsedLyrics = useMemo(() => {
    if (!lyricsRaw) return [];
    return parseLrc(lyricsRaw);
  }, [lyricsRaw]);

  // Find precisely synchronized active lyric line based on current playback second
  const activeLyricText = useMemo(() => {
    if (parsedLyrics.length === 0) return "";
    
    // Don't show lyrics before the vocalist begins singing
    const firstTime = parsedLyrics[0]?.time ?? 0;
    if (currentTime < firstTime - 0.2) {
      return "";
    }

    let foundIdx = -1;
    for (let i = 0; i < parsedLyrics.length; i++) {
      if (parsedLyrics[i].time <= currentTime + 0.15) {
        foundIdx = i;
      } else {
        break;
      }
    }

    if (foundIdx === -1) return "";

    const cur = parsedLyrics[foundIdx];
    const next = parsedLyrics[foundIdx + 1];

    // If next line is far away, don't leave the current line lingering for 10-20 seconds
    const maxDuration = next ? Math.min(next.time - cur.time, 6.0) : 6.0;
    if (currentTime > cur.time + maxDuration) {
      return ""; // Instrumental break
    }

    return cur.text;
  }, [parsedLyrics, currentTime]);

  // Adjust font size dynamically based on line length
  const textSizeClass = useMemo(() => {
    const len = activeLyricText.length;
    if (len > 45) return "text-lg sm:text-xl md:text-2xl";
    if (len > 25) return "text-xl sm:text-2xl md:text-3xl";
    return "text-2xl sm:text-3xl md:text-4xl lg:text-5xl";
  }, [activeLyricText]);

  if (!showLyrics || !lyricsRaw || parsedLyrics.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center p-4 sm:p-8 select-none overflow-hidden bg-gradient-to-t from-black/40 via-transparent to-black/20",
        className
      )}
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl flex flex-col items-center justify-center text-center px-4"
        >
          {/* Subtle Spotify-style badge */}
          <div className="mb-4 px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/90 text-[10px] sm:text-xs font-medium flex items-center gap-2 shadow-xl">
            <span
              className={cn(
                "size-1.5 rounded-full shrink-0",
                isPlaying ? "bg-emerald-400 animate-pulse" : "bg-white/40"
              )}
            />
            <span className="truncate max-w-[220px] sm:max-w-[320px]">
              {currentTrack?.title} • {currentTrack?.artist}
            </span>
          </div>

          {/* Morphing Lyrics in center of photo */}
          <div className="w-full flex items-center justify-center drop-shadow-[0_12px_28px_rgba(0,0,0,0.95)] text-white">
            {activeLyricText ? (
              <MorphingText
                text={activeLyricText}
                className={cn(
                  "text-white font-black tracking-tight drop-shadow-md",
                  textSizeClass
                )}
              />
            ) : (
              <div className="min-h-[5rem] flex items-center justify-center text-white/50 text-sm sm:text-base font-medium italic tracking-wider animate-pulse">
                ♪ ♪ ♪
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
