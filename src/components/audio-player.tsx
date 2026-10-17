"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  ChevronDown,
  Maximize2,
  Volume2,
  VolumeX,
  Disc3,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { defaultPlaylist, type Track } from "@/config/music";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

const formatTime = (seconds: number = 0) => {
  if (isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const CustomSlider = ({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}) => {
  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label="Seek track"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "relative w-full h-3 flex items-center cursor-pointer group select-none",
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        if (rect.width === 0) return;
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        onChange(Math.min(Math.max(percentage, 0), 100));
      }}
    >
      <div className="relative w-full h-1 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-white rounded-full group-hover:bg-primary transition-colors"
          style={{ width: `${value}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
    </div>
  );
};

export interface AudioPlayerProps {
  tracks?: Track[];
  initialExpanded?: boolean;
}

export const AudioPlayer = ({
  tracks = defaultPlaylist,
  initialExpanded = false,
}: AudioPlayerProps) => {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement>(null);
  const trpc = useTRPC();
  const { data: dbTracks } = useQuery({
    ...trpc.playlist.getAll.queryOptions(),
    staleTime: 1000 * 60 * 5,
  });

  const activeTracks = dbTracks && dbTracks.length > 0 ? dbTracks : tracks;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const safeIndex = currentIndex < activeTracks.length ? currentIndex : 0;
  const currentTrack = activeTracks[safeIndex] || activeTracks[0];

  // Try to autoplay once on mount or when user interacts
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let userInteracted = false;
    const handleFirstInteraction = () => {
      if (userInteracted) return;
      userInteracted = true;
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };

    audio.play().catch(() => {
      window.addEventListener("pointerdown", handleFirstInteraction, {
        once: true,
      });
      window.addEventListener("keydown", handleFirstInteraction, {
        once: true,
      });
    });

    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  // When safeIndex changes, if currently playing, start playing new track
  const isMounted = useRef(false);
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [safeIndex, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            setIsPlaying(false);
          });
      }
    }
  };

  const handleNext = useCallback(() => {
    if (activeTracks.length <= 1) return;
    if (isShuffle) {
      let nextIndex = Math.floor(Math.random() * activeTracks.length);
      if (nextIndex === safeIndex) {
        nextIndex = (safeIndex + 1) % activeTracks.length;
      }
      setCurrentIndex(nextIndex);
    } else {
      setCurrentIndex((safeIndex + 1) % activeTracks.length);
    }
  }, [safeIndex, isShuffle, activeTracks.length]);

  const handlePrev = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    if (activeTracks.length <= 1) return;
    setCurrentIndex((safeIndex - 1 + activeTracks.length) % activeTracks.length);
  }, [safeIndex, activeTracks.length]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      if (dur && isFinite(dur)) {
        setProgress((cur / dur) * 100);
        setCurrentTime(cur);
        setDuration(dur);
      }
    }
  };

  const handleSeek = (value: number) => {
    if (audioRef.current && audioRef.current.duration) {
      const time = (value / 100) * audioRef.current.duration;
      if (isFinite(time)) {
        audioRef.current.currentTime = time;
        setProgress(value);
      }
    }
  };

  const handleEnded = () => {
    if (isRepeat && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } else {
      handleNext();
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const nextMuted = !isMuted;
      audioRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  // Do not render inside admin dashboard routes
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 sm:bottom-6 sm:left-6 select-none font-sans">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
        onLoadedMetadata={(e) => {
          const dur = e.currentTarget.duration;
          if (dur && isFinite(dur)) {
            setDuration(dur);
          }
        }}
        src={currentTrack.src}
        preload="metadata"
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {!isExpanded ? (
          /* Mini Floating Pill (Collapsed) */
          <motion.div
            key="mini-player"
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-full bg-[#111111e6] text-white shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md border border-white/15 hover:border-white/25 transition-all max-w-[260px] sm:max-w-[280px]"
            onClick={() => setIsExpanded(true)}
            role="button"
            tabIndex={0}
            aria-label="Buka Pemutar Musik"
          >
            {/* Spinning Album / Disc */}
            <div className="relative size-8 shrink-0 rounded-full overflow-hidden border border-white/20 bg-neutral-900 flex items-center justify-center">
              {currentTrack.cover ? (
                <Image
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  width={32}
                  height={32}
                  unoptimized
                  className={cn(
                    "w-full h-full object-cover rounded-full",
                    isPlaying && "animate-[spin_6s_linear_infinite]"
                  )}
                />
              ) : (
                <Disc3
                  className={cn(
                    "size-5 text-white/80",
                    isPlaying && "animate-[spin_4s_linear_infinite]"
                  )}
                />
              )}
              {/* Disc Center Hole */}
              <div className="absolute size-2 bg-neutral-900 rounded-full border border-white/40" />
            </div>

            {/* Track Info & Equalizer */}
            <div className="flex flex-col min-w-0 flex-1 pr-1">
              <span className="text-xs font-semibold text-white truncate leading-tight">
                {currentTrack.title}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {isPlaying ? (
                  <div className="flex items-end gap-[2px] h-2.5">
                    <span className="w-0.5 bg-emerald-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-2" />
                    <span className="w-0.5 bg-emerald-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-3" />
                    <span className="w-0.5 bg-emerald-400 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-1.5" />
                  </div>
                ) : (
                  <span className="size-1.5 rounded-full bg-white/40" />
                )}
                <span className="text-[10px] text-white/70 truncate">
                  {isPlaying ? "Sedang diputar" : "Jeda"}
                </span>
              </div>
            </div>

            {/* Quick Play / Pause Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="size-7 rounded-full bg-white/10 hover:bg-white/20 text-white shrink-0 hover:text-white"
              aria-label={isPlaying ? "Jeda lagu" : "Putar lagu"}
            >
              {isPlaying ? (
                <Pause className="size-3.5 fill-current" />
              ) : (
                <Play className="size-3.5 fill-current ml-0.5" />
              )}
            </Button>

            {/* Expand Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
              className="size-6 text-white/70 hover:text-white hover:bg-transparent shrink-0"
              aria-label="Perbesar"
            >
              <Maximize2 className="size-3" />
            </Button>
          </motion.div>
        ) : (
          /* Expanded Full Card (Exact layout requested by user) */
          <motion.div
            key="expanded-player"
            className="relative flex flex-col rounded-3xl overflow-hidden bg-[#111111ea] shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-md border border-white/15 p-3.5 w-[280px] max-w-[calc(100vw-2rem)]"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
          >
            {/* Header controls (Minimize & Mute) */}
            <div className="flex items-center justify-between pb-2 mb-1 border-b border-white/10">
              <span className="text-[11px] font-medium tracking-wider uppercase text-white/60">
                Tepe Radio
              </span>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="size-7 rounded-full text-white/70 hover:text-white hover:bg-white/10"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="size-3.5 text-red-400" />
                  ) : (
                    <Volume2 className="size-3.5" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(false)}
                  className="size-7 rounded-full text-white/70 hover:text-white hover:bg-white/10"
                  aria-label="Kecilkan"
                >
                  <ChevronDown className="size-4" />
                </Button>
              </div>
            </div>

            {/* Album Cover */}
            {currentTrack.cover && (
              <div className="bg-white/10 overflow-hidden rounded-[16px] h-[170px] w-full relative shadow-inner">
                <Image
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  width={280}
                  height={170}
                  unoptimized
                  className="object-cover w-full h-full select-none"
                />
                {/* Playing indicator badge over cover */}
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-[10px] text-white font-medium flex items-center gap-1.5">
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      isPlaying
                        ? "bg-emerald-400 animate-ping"
                        : "bg-white/40"
                    )}
                  />
                  <span>{isPlaying ? "Playing" : "Paused"}</span>
                </div>
              </div>
            )}

            {/* Track Info & Progress */}
            <div className="flex flex-col w-full gap-y-2 mt-2">
              <div className="text-center">
                <h3 className="text-white font-bold text-sm truncate px-1">
                  {currentTrack.title}
                </h3>
                <p className="text-white/60 text-xs truncate mt-0.5 px-1">
                  {currentTrack.artist}
                </p>
              </div>

              {/* Slider */}
              <div className="flex flex-col gap-y-1 px-1">
                <CustomSlider
                  value={progress}
                  onChange={handleSeek}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-[11px] text-white/70">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center w-full pt-1">
                <div className="flex items-center justify-between w-full bg-white/5 border border-white/10 rounded-[18px] p-1.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={cn(
                      "text-white/70 hover:bg-white/10 hover:text-white size-8 rounded-full transition-colors",
                      isShuffle && "bg-white/20 text-white font-bold"
                    )}
                    aria-label="Acak lagu"
                  >
                    <Shuffle className="size-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handlePrev}
                    className="text-white/80 hover:bg-white/10 hover:text-white size-8 rounded-full"
                    aria-label="Lagu sebelumnya"
                  >
                    <SkipBack className="size-4 fill-current" />
                  </Button>

                  <Button
                    type="button"
                    onClick={togglePlay}
                    variant="ghost"
                    size="icon"
                    className="text-black bg-white hover:bg-white/90 size-9 rounded-full shadow-md"
                    aria-label={isPlaying ? "Jeda" : "Putar"}
                  >
                    {isPlaying ? (
                      <Pause className="size-4 fill-current text-black" />
                    ) : (
                      <Play className="size-4 fill-current text-black ml-0.5" />
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleNext}
                    className="text-white/80 hover:bg-white/10 hover:text-white size-8 rounded-full"
                    aria-label="Lagu selanjutnya"
                  >
                    <SkipForward className="size-4 fill-current" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsRepeat(!isRepeat)}
                    className={cn(
                      "text-white/70 hover:bg-white/10 hover:text-white size-8 rounded-full transition-colors",
                      isRepeat && "bg-white/20 text-white font-bold"
                    )}
                    aria-label="Ulangi lagu"
                  >
                    <Repeat className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioPlayer;
