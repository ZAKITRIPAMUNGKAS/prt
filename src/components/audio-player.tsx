"use client";

import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
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
  Mic2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { defaultPlaylist, parseLrc, type Track } from "@/config/music";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

const formatTime = (seconds: number = 0) => {
  if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

interface CustomSliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

const CustomSlider = ({ value, onChange, className }: CustomSliderProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const calculatePercentage = (clientX: number) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    if (rect.width === 0) return 0;
    const x = clientX - rect.left;
    return Math.min(Math.max((x / rect.width) * 100, 0), 100);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    const newPercent = calculatePercentage(e.clientX);
    onChange(newPercent);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    const newPercent = calculatePercentage(e.clientX);
    onChange(newPercent);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      e.stopPropagation();
      setIsDragging(false);
    }
  };

  const safeValue = Math.min(Math.max(isNaN(value) ? 0 : value, 0), 100);

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label="Seek track"
      aria-valuenow={Math.round(safeValue)}
      aria-valuemin={0}
      aria-valuemax={100}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn(
        "relative w-full h-4 flex items-center cursor-pointer group select-none touch-none",
        className
      )}
    >
      <div className="relative w-full h-1 bg-white/20 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-white rounded-full group-hover:bg-emerald-400 transition-[background-color] duration-150"
          style={{ width: `${safeValue}%` }}
        />
      </div>
      <div
        className="absolute size-2.5 bg-white rounded-full shadow-md -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ left: `${safeValue}%` }}
      />
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
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

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
  const [showLyrics, setShowLyrics] = useState(true);
  const [showExpandedLyrics, setShowExpandedLyrics] = useState(false);

  const safeIndex = currentIndex < activeTracks.length ? currentIndex : 0;
  const currentTrack = activeTracks[safeIndex] || activeTracks[0];

  // Parse lyrics for current track
  const parsedLyrics = useMemo(() => {
    return parseLrc(currentTrack?.lyrics);
  }, [currentTrack?.lyrics]);

  // Find active lyric index based on audio currentTime
  const activeLyricIndex = useMemo(() => {
    if (parsedLyrics.length === 0) return -1;
    let found = 0;
    for (let i = 0; i < parsedLyrics.length; i++) {
      if (parsedLyrics[i].time <= currentTime + 0.15) {
        found = i;
      } else {
        break;
      }
    }
    return found;
  }, [parsedLyrics, currentTime]);

  const currentLyric = activeLyricIndex >= 0 ? parsedLyrics[activeLyricIndex] : null;

  // Auto-scroll expanded lyrics list to keep active lyric in center
  useEffect(() => {
    if (showExpandedLyrics && lyricsContainerRef.current && activeLyricIndex >= 0) {
      const container = lyricsContainerRef.current;
      const activeEl = container.children[activeLyricIndex] as HTMLElement | undefined;
      if (activeEl) {
        const elTop = activeEl.offsetTop;
        const elHeight = activeEl.offsetHeight;
        const containerHeight = container.clientHeight;
        container.scrollTo({
          top: elTop - containerHeight / 2 + elHeight / 2,
          behavior: "smooth",
        });
      }
    }
  }, [activeLyricIndex, showExpandedLyrics]);

  // Safe Playback Helpers avoiding race conditions
  const playAudio = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (audio.ended || (audio.duration && audio.currentTime >= audio.duration - 0.2)) {
        audio.currentTime = 0;
      }
      await audio.play();
    } catch (err: unknown) {
      console.debug("Audio play interrupted or waiting for user interaction:", err);
    }
  }, []);

  const pauseAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void playAudio();
    } else {
      pauseAudio();
    }
  }, [playAudio, pauseAudio]);

  const handleNext = useCallback(() => {
    if (activeTracks.length <= 1) {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        void playAudio();
      }
      return;
    }
    if (isShuffle) {
      let nextIndex = Math.floor(Math.random() * activeTracks.length);
      if (nextIndex === safeIndex) {
        nextIndex = (safeIndex + 1) % activeTracks.length;
      }
      setCurrentIndex(nextIndex);
    } else {
      setCurrentIndex((safeIndex + 1) % activeTracks.length);
    }
  }, [safeIndex, isShuffle, activeTracks.length, playAudio]);

  const handlePrev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 2) {
      audio.currentTime = 0;
      return;
    }
    if (activeTracks.length <= 1) {
      if (audio) {
        audio.currentTime = 0;
      }
      return;
    }
    setCurrentIndex((safeIndex - 1 + activeTracks.length) % activeTracks.length);
  }, [safeIndex, activeTracks.length]);

  const handleEnded = useCallback(() => {
    const audio = audioRef.current;
    if (isRepeat && audio) {
      audio.currentTime = 0;
      void playAudio();
    } else if (activeTracks.length > 1) {
      handleNext();
    } else if (audio) {
      audio.currentTime = 0;
      setCurrentTime(0);
      setProgress(0);
      setIsPlaying(false);
    }
  }, [isRepeat, activeTracks.length, handleNext, playAudio]);

  const updateDuration = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const dur = audio.duration;
    if (dur && isFinite(dur) && dur > 0) {
      setDuration(dur);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const cur = audio.currentTime;
    const dur = audio.duration || duration;
    setCurrentTime(cur);
    if (dur && isFinite(dur) && dur > 0) {
      setDuration(dur);
      setProgress((cur / dur) * 100);
    }
  };

  const handleSeek = (valuePercent: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const dur = audio.duration || duration;
    if (dur && isFinite(dur) && dur > 0) {
      const targetTime = (valuePercent / 100) * dur;
      audio.currentTime = Math.min(Math.max(targetTime, 0), dur);
      setCurrentTime(audio.currentTime);
      setProgress(valuePercent);
    }
  };

  const jumpToLyric = (timeSec: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const dur = audio.duration || duration;
    audio.currentTime = timeSec;
    setCurrentTime(timeSec);
    if (dur && isFinite(dur) && dur > 0) {
      setProgress((timeSec / dur) * 100);
    }
    if (audio.paused) {
      void playAudio();
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextMuted = !isMuted;
    audio.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  // Do not render inside admin dashboard routes
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 sm:bottom-6 sm:left-6 select-none font-sans flex flex-col items-start pointer-events-none">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={updateDuration}
        onDurationChange={updateDuration}
        onCanPlay={updateDuration}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPlaying={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
        src={currentTrack.src}
        preload="auto"
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {!isExpanded ? (
          /* Mini Floating Pill Container (With synced floating lyrics above) */
          <div key="mini-container" className="flex flex-col items-start">
            {/* Floating Live Karaoke Lyric Bubble */}
            <AnimatePresence mode="wait">
              {showLyrics && currentLyric && (
                <motion.div
                  key={`lyric-${activeLyricIndex}`}
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="mb-2 max-w-[280px] sm:max-w-[320px] px-3.5 py-1.5 rounded-2xl bg-[#111111eb] text-white backdrop-blur-md border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-2 select-none pointer-events-auto cursor-pointer"
                  onClick={() => setIsExpanded(true)}
                  role="button"
                  tabIndex={0}
                  aria-label="Buka Lirik Penuh"
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full shrink-0",
                      isPlaying ? "bg-emerald-400 animate-pulse" : "bg-white/40"
                    )}
                  />
                  <p className="text-[11px] sm:text-xs font-medium text-white/95 truncate italic tracking-wide">
                    &ldquo;{currentLyric.text}&rdquo;
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mini Player Pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#111111e6] text-white shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md border border-white/15 hover:border-white/25 transition-all max-w-[280px] sm:max-w-[310px] pointer-events-auto cursor-pointer"
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
                      "w-full h-full object-cover rounded-full transition-transform duration-500",
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

              {/* Toggle Lyrics Subtitle Button */}
              {parsedLyrics.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLyrics((prev) => !prev);
                  }}
                  className={cn(
                    "size-7 rounded-full shrink-0 transition-colors",
                    showLyrics
                      ? "text-emerald-400 bg-white/10 hover:bg-white/20 hover:text-emerald-300"
                      : "text-white/50 hover:bg-white/10 hover:text-white"
                  )}
                  title={showLyrics ? "Sembunyikan Lirik" : "Tampilkan Lirik"}
                  aria-label="Toggle Lirik"
                >
                  <Mic2 className="size-3.5" />
                </Button>
              )}

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
          </div>
        ) : (
          /* Expanded Full Card */
          <motion.div
            key="expanded-player"
            className="relative flex flex-col rounded-3xl overflow-hidden bg-[#111111ea] shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-md border border-white/15 p-3.5 w-[290px] max-w-[calc(100vw-2rem)] pointer-events-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
          >
            {/* Header controls (Tepe Radio, Lyrics Toggle, Mute & Minimize) */}
            <div className="flex items-center justify-between pb-2 mb-1 border-b border-white/10">
              <span className="text-[11px] font-medium tracking-wider uppercase text-white/60">
                Tepe Radio
              </span>
              <div className="flex items-center gap-1">
                {parsedLyrics.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowExpandedLyrics((prev) => !prev)}
                    className={cn(
                      "size-7 rounded-full transition-colors",
                      showExpandedLyrics
                        ? "text-emerald-400 bg-white/20 hover:text-emerald-300"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    )}
                    title={showExpandedLyrics ? "Tampilkan Cover" : "Tampilkan Lirik"}
                    aria-label="Lihat Lirik Penuh"
                  >
                    <Mic2 className="size-3.5" />
                  </Button>
                )}
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

            {/* Main Area: Album Cover OR Full Scrolling Karaoke Lyrics */}
            {showExpandedLyrics ? (
              <div
                ref={lyricsContainerRef}
                className="bg-black/40 border border-white/10 overflow-y-auto rounded-[16px] h-[170px] w-full p-3 flex flex-col gap-2 scroll-smooth scrollbar-thin scrollbar-thumb-white/20 select-text"
              >
                {parsedLyrics.length > 0 ? (
                  parsedLyrics.map((line, idx) => {
                    const isActive = idx === activeLyricIndex;
                    return (
                      <button
                        key={`${line.time}-${idx}`}
                        type="button"
                        onClick={() => jumpToLyric(line.time)}
                        className={cn(
                          "text-left transition-all duration-200 py-1 px-1.5 rounded-lg flex items-center gap-2 w-full group",
                          isActive
                            ? "text-white font-semibold text-xs bg-white/15 scale-[1.02]"
                            : "text-white/45 text-[11px] hover:text-white/80 hover:bg-white/5"
                        )}
                      >
                        <span
                          className={cn(
                            "size-1.5 rounded-full shrink-0 transition-all",
                            isActive ? "bg-emerald-400 scale-125" : "bg-transparent group-hover:bg-white/30"
                          )}
                        />
                        <span className="leading-tight">{line.text}</span>
                      </button>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-white/50 text-center">
                    Lirik belum tersedia untuk lagu ini
                  </div>
                )}
              </div>
            ) : (
              currentTrack.cover && (
                <div className="bg-white/10 overflow-hidden rounded-[16px] h-[170px] w-full relative shadow-inner">
                  <Image
                    src={currentTrack.cover}
                    alt={currentTrack.title}
                    width={290}
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

                  {/* Active Lyric Subtitle Overlay over cover bottom */}
                  {currentLyric && (
                    <div className="absolute inset-x-2 bottom-2 px-2.5 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 text-center">
                      <p className="text-[11px] font-medium text-white truncate italic tracking-wide">
                        &ldquo;{currentLyric.text}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              )
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
                    className="text-black bg-white hover:bg-white/90 size-9 rounded-full shadow-md transition-transform active:scale-95"
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
