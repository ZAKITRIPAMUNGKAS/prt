"use client";

// UI Components
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

  return (
    <>
      <div className="w-full h-full relative rounded-xl overflow-hidden bg-muted">
        <Carousel
          className="w-full h-full"
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
                onClick={(event) => {
                  // Embla prevents the click event following a drag. Respect it
                  // so the lightbox opens only after an intentional click.
                  if (!event.defaultPrevented) openPhoto(photo.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openPhoto(photo.id);
                  }
                }}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className="flex-[0_0_100%] min-w-0 h-full relative cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary select-none touch-pan-y"
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
                  className="w-full h-full object-cover pointer-events-none select-none"
                />
              </div>
            );
          })}
        </Carousel>
      </div>

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
