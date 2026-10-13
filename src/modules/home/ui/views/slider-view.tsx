"use client";

// UI Components
import { useRef } from "react";
import Link from "next/link";
import Carousel from "@/components/photo-carousel";
import BlurImage from "@/components/blur-image";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ImageOff } from "lucide-react";
import { PhotoLightbox, usePhotoLightbox } from "@/components/photo-lightbox";

export const SliderView = () => {
  const trpc = useTRPC();
  const { data: photos } = useSuspenseQuery(
    trpc.home.getManyLikePhotos.queryOptions({ limit: 10 })
  );
  const { activePhotoId, openPhoto, closePhoto, setActivePhotoId } = usePhotoLightbox();
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  if (photos.length === 0) {
    return (
      <EmptyState
        icon={<ImageOff className="h-12 w-12" />}
        title="No photos yet"
        description="Upload some photos and like your favorites to get started"
        action={
          <Button asChild>
            <Link href="/dashboard/photos">Go to Dashboard</Link>
          </Button>
        }
        height="h-full"
      />
    );
  }

  // Embla Carousel loop requires at least 3 slides to loop seamlessly in both directions.
  // If there are exactly 2 photos, duplicate them to 4 slides so Embla can loop infinitely.
  const isDuplicated = photos.length === 2;
  const displayPhotos = isDuplicated ? [...photos, ...photos] : photos;

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePhotoClick = (e: React.MouseEvent, photoId: string) => {
    if (pointerStartRef.current) {
      const dx = Math.abs(e.clientX - pointerStartRef.current.x);
      const dy = Math.abs(e.clientY - pointerStartRef.current.y);
      if (dx > 6 || dy > 6) {
        // Drag occurred, ignore click
        return;
      }
    }
    openPhoto(photoId);
  };

  return (
    <>
      <Carousel
        className="absolute top-0 left-0 w-full h-full rounded-xl"
        containerClassName="h-full"
        dotsCount={photos.length}
      >
        {displayPhotos.map((photo, index) => {
          const isFirstSlide = index === 0;

          return (
            <div
              key={`${photo.id}-${index}`}
              role="button"
              tabIndex={0}
              onPointerDown={handlePointerDown}
              onClick={(e) => handlePhotoClick(e, photo.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openPhoto(photo.id);
                }
              }}
              className="flex-[0_0_100%] min-w-0 h-full relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary select-none"
              aria-label={`View photo: ${photo.title}`}
            >
              <BlurImage
                src={keyToUrl(photo.url)}
                alt={photo.title}
                fill
                sizes="(max-width: 1023px) 100vw, 50vw"
                loading={isFirstSlide ? "eager" : "lazy"}
                fetchPriority={isFirstSlide ? "high" : undefined}
                blurhash={photo.blurData}
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>
          );
        })}
      </Carousel>

      <PhotoLightbox
        photos={photos}
        activePhotoId={activePhotoId}
        onClose={closePhoto}
        onNavigate={setActivePhotoId}
      />
    </>
  );
};

export const SliderViewLoadingStatus = () => {
  return (
    <div className="w-full lg:w-1/2 h-[70vh] lg:fixed lg:top-0 lg:left-0 lg:h-screen p-0 lg:p-3 rounded-xl">
      <Skeleton className="w-full h-full" />
    </div>
  );
};
