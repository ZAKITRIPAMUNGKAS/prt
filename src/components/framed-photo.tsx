"use client";

import { cn } from "@/lib/utils";
import BlurImage from "./blur-image";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import { BrandsLogo } from "./brands-logo";
import { Camera, MapPin } from "lucide-react";

interface FramedPhotoProps {
  src: string;
  alt?: string;
  blurhash: string;
  width?: number;
  height?: number;
  className?: string;
  frameClassName?: string;
  metadata?: {
    title?: string | null;
    placeFormatted?: string | null;
    city?: string | null;
    country?: string | null;
    make?: string | null;
    model?: string | null;
    focalLength?: number | null;
    fNumber?: number | null;
    exposureTime?: number | null;
    iso?: number | null;
    dateTimeOriginal?: string | Date | null;
  };
}

const formatShutterSpeed = (exposureTime?: number | null) => {
  if (!exposureTime || exposureTime <= 0) return null;
  return exposureTime < 1
    ? `1/${Math.round(1 / exposureTime)}s`
    : `${Number(exposureTime.toFixed(1))}s`;
};

const formatCaptureDate = (value?: string | Date | null) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

export function FramedPhoto({
  src,
  alt = "Framed photo",
  blurhash,
  width,
  height,
  className,
  frameClassName,
  metadata,
}: FramedPhotoProps) {
  const location = metadata?.placeFormatted ||
    [metadata?.city, metadata?.country].filter(Boolean).join(", ");
  const cameraName = [metadata?.make, metadata?.model].filter(Boolean).join(" ");
  const specs = [
    metadata?.fNumber ? `f/${metadata.fNumber}` : null,
    metadata?.focalLength ? `${Math.round(metadata.focalLength)}mm` : null,
    formatShutterSpeed(metadata?.exposureTime),
    metadata?.iso ? `ISO ${metadata.iso}` : null,
  ].filter(Boolean);
  const captureDate = formatCaptureDate(metadata?.dateTimeOriginal);

  return (
    <div
      className={cn(
        "relative inline-flex max-w-full flex-col bg-[#fbfaf6] p-3 shadow-[0_18px_38px_rgba(0,0,0,0.36)] ring-1 ring-black/15 sm:p-4",
        frameClassName
      )}
    >
      <div className="relative min-h-0 flex-1 overflow-hidden border border-black/10 bg-neutral-100">
        <BlurImage
          src={keyToUrl(src)}
          alt={alt}
          blurhash={blurhash}
          className={cn(
            "block w-full h-auto max-h-[60vh] object-cover",
            className
          )}
          width={width}
          height={height}
        />
      </div>

      {metadata && (
        <div className="min-w-0 px-1 pb-1 pt-3 text-neutral-800 sm:pt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-tight">
                {metadata.title || alt}
              </p>
              {(location || captureDate) && (
                <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-neutral-500">
                  {location && <MapPin className="size-3 shrink-0" />}
                  <span className="truncate" suppressHydrationWarning>{location || captureDate}</span>
                  {location && captureDate && <span className="text-neutral-300">/</span>}
                  {location && captureDate && <span className="shrink-0" suppressHydrationWarning>{captureDate}</span>}
                </p>
              )}
            </div>

            <div className="flex h-7 w-12 shrink-0 items-center justify-end">
              {metadata.make ? (
                <BrandsLogo brand={metadata.make} width={44} height={24} />
              ) : (
                <Camera className="size-4 text-neutral-400" aria-label="Camera" />
              )}
            </div>
          </div>

          {(cameraName || specs.length > 0) && (
            <p className="mt-3 border-t border-neutral-200 pt-2 text-[11px] leading-tight text-neutral-500">
              {[cameraName, specs.join(" / ")].filter(Boolean).join(" / ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
