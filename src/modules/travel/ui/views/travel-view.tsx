"use client";

import { useState } from "react";
import Footer from "@/components/footer";
import { CoverPhoto } from "../components/cover-photo";
import { Introduction } from "../components/introduction";
import { CityItem } from "../components/city-item";
import type { PublicCitySet } from "../../types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";
import { PhotoLightbox, usePhotoLightbox, type LightboxPhoto } from "@/components/photo-lightbox";

export const TravelView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.travel.getCitySets.queryOptions());
  const { activePhotoId, openPhoto, closePhoto, setActivePhotoId } = usePhotoLightbox();

  // Initialize with first city directly, no useEffect needed
  const [activeCity, setActiveCity] = useState<PublicCitySet | null>(
    () => data?.[0] ?? null
  );

  const lightboxPhotos: LightboxPhoto[] = (data || []).map((item) => ({
    id: item.coverPhoto.id,
    url: item.coverPhoto.url,
    title: item.coverPhoto.title || item.city,
    blurData: item.coverPhoto.blurData,
    width: item.coverPhoto.width,
    height: item.coverPhoto.height,
    make: item.coverPhoto.make,
    model: item.coverPhoto.model,
    lensModel: item.coverPhoto.lensModel,
    focalLength: item.coverPhoto.focalLength,
    focalLength35mm: item.coverPhoto.focalLength35mm,
    fNumber: item.coverPhoto.fNumber,
    iso: item.coverPhoto.iso,
    exposureTime: item.coverPhoto.exposureTime,
    dateTimeOriginal: item.coverPhoto.dateTimeOriginal,
    city: item.city,
    country: item.country,
    countryCode: item.countryCode,
    placeFormatted: item.coverPhoto.placeFormatted,
  }));

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      <CoverPhoto
        citySet={activeCity || data[0]}
        citySets={data}
        onPhotoClick={openPhoto}
      />

      {/* Spacer for fixed left content */}
      <div className="hidden lg:block lg:w-1/2" />

      {/* RIGHT CONTENT - Scrollable */}
      <div className="w-full mt-3 lg:mt-0 lg:w-1/2 space-y-3 pb-3">
        <Introduction />
        <div className="space-y-3">
          {data.map((city) => (
            <CityItem key={city.id} city={city} onMouseEnter={setActiveCity} />
          ))}
        </div>
        <Footer />
      </div>

      <PhotoLightbox
        photos={lightboxPhotos}
        activePhotoId={activePhotoId}
        onClose={closePhoto}
        onNavigate={setActivePhotoId}
      />
    </div>
  );
};

export const LoadingStatus = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      {/* LEFT CONTENT - Fixed cover photo skeleton */}
      <div className="w-full h-[70vh] lg:w-1/2 lg:fixed lg:top-0 lg:left-0 lg:h-screen p-0 lg:p-3">
        <Skeleton className="w-full h-full rounded-xl" />
      </div>

      {/* Spacer for fixed left content */}
      <div className="hidden lg:block lg:w-1/2" />

      {/* RIGHT CONTENT - Scrollable */}
      <div className="w-full mt-3 lg:mt-0 lg:w-1/2 space-y-3 pb-3">
        <Introduction />
        <div className="space-y-3">
          <Skeleton className="w-full h-12 rounded-lg" />
          <Skeleton className="w-full h-12 rounded-lg" />
          <Skeleton className="w-full h-12 rounded-lg" />
          <Skeleton className="w-full h-12 rounded-lg" />
          <Skeleton className="w-full h-12 rounded-lg" />
        </div>
        <Footer />
      </div>
    </div>
  );
};
