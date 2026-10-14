"use client";

import BlurImage from "@/components/blur-image";
import Footer from "@/components/footer";
import VectorCombined from "@/components/vector-combined";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { PhotoLightbox, usePhotoLightbox } from "@/components/photo-lightbox";
import { Skeleton } from "@/components/ui/skeleton";
import CardContainer from "@/components/card-container";

interface Props {
  city: string;
}

export const CityView = ({ city }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.travel.getOne.queryOptions({ city }));

  const { activePhotoId, openPhoto, closePhoto, setActivePhotoId } = usePhotoLightbox();

  const coverPhoto = data.photos.find((item) => data.coverPhotoId === item.id);
  const coverPhotoDate = coverPhoto?.dateTimeOriginal
    ? new Date(coverPhoto.dateTimeOriginal)
    : null;
  const coverPhotoYear =
    coverPhotoDate && !Number.isNaN(coverPhotoDate.getTime())
      ? coverPhotoDate.getUTCFullYear()
      : "-";

  return (
    <div className="size-full">
      <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row w-full">
        {/* LEFT CONTENT - Fixed */}
        <div className="w-full h-[70vh] lg:w-1/2 lg:fixed lg:top-0 lg:left-0 lg:h-screen p-0 lg:p-3">
          <div
            className="w-full h-full relative cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
            role="button"
            tabIndex={0}
            style={{
              viewTransitionName: data?.city
                ? `city-${encodeURIComponent(data.city.toLowerCase())}`
                : undefined,
            }}
            onClick={() => coverPhoto && openPhoto(coverPhoto.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (coverPhoto) openPhoto(coverPhoto.id);
              }
            }}
            aria-label={`View cover photo: ${data?.city || "City"}`}
          >
            <BlurImage
              src={keyToUrl(coverPhoto?.url) || "/placeholder.svg"}
              alt={data?.city || "City cover photo"}
              fill
              quality={75}
              blurhash={coverPhoto?.blurData || ""}
              sizes="75vw"
              className="object-cover rounded-xl overflow-hidden transition-all duration-300 group-hover:brightness-95"
            />
            <div className="absolute right-0 bottom-0">
              <VectorCombined title={data?.city || ""} position="bottom-right" />
            </div>
          </div>
        </div>

        {/* Spacer for fixed left content */}
        <div className="hidden lg:block lg:w-1/2" />

        {/* RIGHT CONTENT - Scrollable */}
        <div className="w-full lg:w-1/2 space-y-3 pb-3">
          {/* CITY INFO CARD  */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 2xl:grid-cols-3 gap-4 items-stretch">
            <div className="col-span-1 md:col-span-2 lg:col-span-1 2xl:col-span-2">
              <div className="flex flex-col p-6 sm:p-8 justify-between gap-6 bg-muted rounded-xl font-light relative h-full">
                <div className="flex gap-4 items-center">
                  {/* NAME  */}
                  <div className="flex flex-col gap-1">
                    <h1 className="text-3xl sm:text-4xl font-normal tracking-tight">
                      {data.city} {data.countryCode}
                    </h1>
                  </div>
                </div>

                {data.description ? (
                  <div>
                    <p className="text-muted-foreground text-sm sm:text-[15px] leading-relaxed">
                      {data.description}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground/60 italic">
                    No description provided
                  </p>
                )}
              </div>
            </div>

            <div className="col-span-1 md:col-span-1 lg:col-span-1 2xl:col-span-1 flex flex-col justify-between gap-2.5">
              <div className="w-full p-3 lg:p-4 bg-muted rounded-xl flex justify-between items-center">
                <p className="text-xs text-muted-foreground">Country</p>
                <p className="text-xs font-medium">{data.country}</p>
              </div>

              <div className="w-full p-3 lg:p-4 bg-muted rounded-xl flex justify-between items-center">
                <p className="text-xs text-muted-foreground">City</p>
                <p className="text-xs font-medium">{data.city}</p>
              </div>

              <div className="w-full p-3 lg:p-4 bg-muted rounded-xl flex justify-between items-center">
                <p className="text-xs text-muted-foreground">Year</p>
                <p className="text-xs font-medium">{coverPhotoYear}</p>
              </div>

              <div className="w-full p-3 lg:p-4 bg-muted rounded-xl flex justify-between items-center">
                <p className="text-xs text-muted-foreground">Photos</p>
                <p className="text-xs font-medium">{data.photos?.length}</p>
              </div>
            </div>
          </div>

          {/* IMAGES (3 COLUMNS) */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3">
            {data.photos?.map((photo) => (
              <div
                key={photo.id}
                role="button"
                tabIndex={0}
                onClick={() => openPhoto(photo.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openPhoto(photo.id);
                  }
                }}
                className="group flex flex-col cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl transition-all duration-200 active:scale-[0.98]"
                aria-label={`View photo: ${photo.title}`}
              >
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-muted border border-border/40 group-hover:border-primary/50 transition-colors">
                  <BlurImage
                    src={keyToUrl(photo.url)}
                    alt={photo.title}
                    blurhash={photo.blurData || ""}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="pt-2 px-0.5">
                  <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                    {photo.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate" suppressHydrationWarning>
                    {photo.dateTimeOriginal
                      ? format(new Date(photo.dateTimeOriginal), "d MMM yyyy")
                      : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* FOOTER  */}
          <Footer />
        </div>
      </div>

      {/* Full-screen Photo Lightbox with EXIF panel */}
      <PhotoLightbox
        photos={data.photos}
        activePhotoId={activePhotoId}
        onClose={closePhoto}
        onNavigate={setActivePhotoId}
      />
    </div>
  );
};

export const CityViewLoadingStatus = () => {
  return (
    <div className="size-full">
      <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row w-full">
        {/* LEFT SKELETON */}
        <div className="w-full h-[70vh] lg:w-1/2 lg:fixed lg:top-0 lg:left-0 lg:h-screen p-0 lg:p-3">
          <Skeleton className="w-full h-full rounded-xl" />
        </div>

        {/* Spacer */}
        <div className="hidden lg:block lg:w-1/2" />

        {/* RIGHT SKELETON */}
        <div className="w-full lg:w-1/2 space-y-3 pb-3">
          <CardContainer>
            <div className="flex flex-col p-8 md:p-12 gap-6">
              <Skeleton className="w-48 h-8 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-3/4 h-4" />
              </div>
            </div>
          </CardContainer>

          <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-2 rounded-xl">
                <Skeleton className="w-full aspect-4/3 rounded-xl" />
                <div className="space-y-1 px-0.5">
                  <Skeleton className="w-24 h-3.5 rounded" />
                  <Skeleton className="w-16 h-3 rounded" />
                </div>
              </div>
            ))}
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};
