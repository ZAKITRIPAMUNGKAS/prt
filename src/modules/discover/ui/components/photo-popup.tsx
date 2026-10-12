import BlurImage from "@/components/blur-image";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import type { PhotoPoint } from "@/modules/discover/lib/clustering";

interface PhotoPopupProps {
  photo: PhotoPoint;
  onClick?: () => void;
}

export const PhotoPopup = ({ photo, onClick }: PhotoPopupProps) => (
  <div
    className="w-64 h-64 cursor-pointer focus-visible:outline-none"
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick?.();
      }
    }}
    aria-label={`View photo: ${photo.title}`}
  >
    <BlurImage
      src={keyToUrl(photo.url)}
      alt={photo.title}
      width={256}
      height={256}
      className="object-cover w-full h-full"
      blurhash={photo.blurData}
    />
    <div className="p-2 bg-white dark:bg-gray-900">
      <p className="text-sm font-medium truncate">{photo.title}</p>
    </div>
  </div>
);
