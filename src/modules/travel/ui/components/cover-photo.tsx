import BlurImage from "@/components/blur-image";
import type { PublicCitySet } from "../../types";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import VectorCombined from "@/components/vector-combined";

interface CoverPhotoProps {
  citySet: PublicCitySet;
  citySets: PublicCitySet[];
  onPhotoClick?: (photoId: string) => void;
}

export const CoverPhoto = ({ citySet, citySets, onPhotoClick }: CoverPhotoProps) => {
  return (
    <div className="w-full h-[70vh] lg:w-1/2 lg:fixed lg:top-0 lg:left-0 lg:h-screen p-0 lg:p-3">
      <div
        className="w-full h-full relative rounded-xl overflow-hidden cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        role="button"
        tabIndex={0}
        onClick={() => onPhotoClick?.(citySet.coverPhoto.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onPhotoClick?.(citySet.coverPhoto.id);
          }
        }}
        aria-label={`View photo: ${citySet.city}`}
      >
        {/* Cover photo */}
        <div className="relative w-full h-full">
          {citySets?.map((city) => (
            <div
              key={city.id}
              className={`absolute inset-0 transition-opacity duration-300 ${
                city.id === citySet.id ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <BlurImage
                src={keyToUrl(city.coverPhoto.url)}
                alt={city.city}
                fill
                blurhash={city.coverPhoto.blurData}
                sizes="75vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="absolute right-0 bottom-0 z-10">
          <VectorCombined title={citySet?.city || ""} position="bottom-right" />
        </div>
      </div>
    </div>
  );
};
