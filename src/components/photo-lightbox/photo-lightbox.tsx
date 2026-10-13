"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X, Info } from "lucide-react";
import { FramedPhoto } from "@/components/framed-photo";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import { cn } from "@/lib/utils";
import { ExifPanel } from "./exif-panel";
import type { LightboxPhoto } from "./types";

interface PhotoLightboxProps {
  photos: LightboxPhoto[];
  activePhotoId: string | null;
  onClose: () => void;
  onNavigate?: (photoId: string) => void;
}

export function PhotoLightbox({
  photos,
  activePhotoId,
  onClose,
  onNavigate,
}: PhotoLightboxProps) {
  const isOpen = Boolean(activePhotoId);
  const [isExifOpen, setIsExifOpen] = useState(false);

  // Find index of current photo
  const currentIndex = photos.findIndex((p) => p.id === activePhotoId);
  const currentPhoto = currentIndex !== -1 ? photos[currentIndex] : null;

  // Touch gesture tracking for swipe
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Navigate handlers
  const handlePrev = useCallback(() => {
    if (photos.length <= 1 || currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    onNavigate?.(photos[prevIndex].id);
  }, [photos, currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (photos.length <= 1 || currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % photos.length;
    onNavigate?.(photos[nextIndex].id);
  }, [photos, currentIndex, onNavigate]);

  // Preload next and prev images via Next.js image optimizer proxy
  useEffect(() => {
    if (currentIndex === -1 || photos.length <= 1) return;

    const nextPhoto = photos[(currentIndex + 1) % photos.length];
    const prevPhoto = photos[(currentIndex - 1 + photos.length) % photos.length];

    if (nextPhoto?.url) {
      const imgNext = new Image();
      imgNext.src = `/_next/image?url=${encodeURIComponent(keyToUrl(nextPhoto.url))}&w=1920&q=75`;
    }
    if (prevPhoto?.url) {
      const imgPrev = new Image();
      imgPrev.src = `/_next/image?url=${encodeURIComponent(keyToUrl(prevPhoto.url))}&w=1920&q=75`;
    }
  }, [currentIndex, photos]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "i" || e.key === "I") {
        e.preventDefault();
        setIsExifOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handlePrev, handleNext]);

  // Touch event handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchEndX - touchStartXRef.current;
    const diffY = touchEndY - touchStartYRef.current;

    // Only register horizontal swipes if movement is primarily horizontal and > 50px
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  if (!isOpen || !currentPhoto) return null;

  const locationLabel = currentPhoto.placeFormatted ||
    [currentPhoto.city, currentPhoto.country].filter(Boolean).join(", ");

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/95 backdrop-blur-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200"
          )}
        />

        <DialogPrimitive.Content
          data-slot="lightbox-content"
          aria-describedby={undefined}
          className={cn(
            "fixed inset-0 z-50 flex flex-col justify-between overflow-hidden outline-none select-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200"
          )}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={(e) => {
            // Close if user clicks dark empty background
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          {/* Accessible Title */}
          <DialogPrimitive.Title className="sr-only">
            {currentPhoto.title || "Photo viewer"}
          </DialogPrimitive.Title>

          {/* Top Bar: Title & Controls */}
          <header className="relative z-20 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
            <div className="flex flex-col min-w-0 pr-4">
              <h2 className="text-base sm:text-lg font-semibold text-white truncate drop-shadow-sm">
                {currentPhoto.title}
              </h2>
              {locationLabel && (
                <p className="text-xs sm:text-sm text-neutral-300 truncate drop-shadow-sm">
                  {locationLabel}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* EXIF Toggle Button */}
              <button
                type="button"
                onClick={() => setIsExifOpen((prev) => !prev)}
                className={cn(
                  "min-w-[44px] min-h-[44px] p-2.5 rounded-full flex items-center justify-center transition-all",
                  "focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none",
                  isExifOpen
                    ? "bg-white text-black shadow-lg"
                    : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md"
                )}
                aria-label={isExifOpen ? "Hide photo EXIF details" : "Show photo EXIF details"}
                aria-expanded={isExifOpen}
              >
                <Info className="w-5 h-5" />
              </button>

              {/* Close Button */}
              <DialogPrimitive.Close
                asChild
                onClick={onClose}
              >
                <button
                  type="button"
                  className={cn(
                    "min-w-[44px] min-h-[44px] p-2.5 rounded-full flex items-center justify-center text-white",
                    "bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors",
                    "focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                  )}
                  aria-label="Close photo lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
              </DialogPrimitive.Close>
            </div>
          </header>

          {/* Main Photo Area */}
          <main
            className="relative flex-1 flex items-center justify-center p-2 sm:p-6 min-h-0"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                onClose();
              }
            }}
          >
            {/* Left Nav Button */}
            {photos.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className={cn(
                  "absolute left-4 z-20 hidden sm:flex items-center justify-center",
                  "min-w-[44px] min-h-[44px] p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                )}
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Framed Photo Container */}
            <div
              className="relative flex items-center justify-center p-2 sm:p-4 select-none max-w-full max-h-[78dvh]"
              onClick={(e) => e.stopPropagation()}
            >
              <FramedPhoto
                key={currentPhoto.id}
                src={currentPhoto.url}
                alt={currentPhoto.title || "Photo"}
                blurhash={currentPhoto.blurData || ""}
                width={currentPhoto.width || 1200}
                height={currentPhoto.height || 800}
                className="max-h-[66dvh] sm:max-h-[72dvh] w-auto h-auto object-contain"
                frameClassName="max-w-[94vw] max-h-[78dvh] flex items-center justify-center"
              />
            </div>

            {/* Right Nav Button */}
            {photos.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className={cn(
                  "absolute right-4 z-20 hidden sm:flex items-center justify-center",
                  "min-w-[44px] min-h-[44px] p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                )}
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Collapsible Floating EXIF Panel */}
            <div className="absolute right-4 bottom-16 sm:bottom-6 z-30 pointer-events-auto">
              <ExifPanel
                photo={currentPhoto}
                isOpen={isExifOpen}
              />
            </div>
          </main>

          {/* Bottom Bar: Index indicator & Mobile Nav Controls */}
          <footer className="relative z-20 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-auto">
            <div className="text-xs sm:text-sm text-neutral-400 font-mono">
              {photos.length > 1 && `${currentIndex + 1} / ${photos.length}`}
            </div>

            {/* Mobile Nav Arrows */}
            {photos.length > 1 && (
              <div className="flex sm:hidden items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="min-w-[44px] min-h-[44px] p-2.5 rounded-full bg-white/10 active:bg-white/30 text-white backdrop-blur-md flex items-center justify-center"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="min-w-[44px] min-h-[44px] p-2.5 rounded-full bg-white/10 active:bg-white/30 text-white backdrop-blur-md flex items-center justify-center"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </footer>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
