"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { BrandsLogo } from "@/components/brands-logo";
import { Camera, Aperture, Timer, Eye, Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LightboxPhoto } from "./types";

interface ExifPanelProps {
  photo: LightboxPhoto;
  isOpen: boolean;
  className?: string;
}

export function ExifPanel({ photo, isOpen, className }: ExifPanelProps) {
  // Format exposure time specifically as "1/250 s" for < 1s or "X s"
  const formattedShutter = useMemo(() => {
    if (typeof photo.exposureTime !== "number" || photo.exposureTime <= 0) return null;
    if (photo.exposureTime < 1) {
      return `1/${Math.round(1 / photo.exposureTime)} s`;
    }
    return `${Number(photo.exposureTime.toFixed(1))} s`;
  }, [photo.exposureTime]);

  const formattedFNumber = useMemo(() => {
    if (typeof photo.fNumber !== "number" || photo.fNumber <= 0) return null;
    const isInt = Number.isInteger(photo.fNumber) || photo.fNumber % 1 === 0;
    return `f/${isInt ? Math.round(photo.fNumber) : photo.fNumber.toFixed(1)}`;
  }, [photo.fNumber]);

  const formattedFocal = useMemo(() => {
    if (!photo.focalLength && !photo.focalLength35mm) return null;
    if (photo.focalLength && photo.focalLength35mm && photo.focalLength !== photo.focalLength35mm) {
      return `${Math.round(photo.focalLength)}mm (${Math.round(photo.focalLength35mm)}mm eq.)`;
    }
    const val = photo.focalLength ?? photo.focalLength35mm;
    return val ? `${Math.round(val)}mm` : null;
  }, [photo.focalLength, photo.focalLength35mm]);

  const formattedIso = useMemo(() => {
    if (!photo.iso) return null;
    return `ISO ${photo.iso}`;
  }, [photo.iso]);

  const formattedDate = useMemo(() => {
    if (!photo.dateTimeOriginal) return null;
    const dateObj = new Date(photo.dateTimeOriginal);
    if (Number.isNaN(dateObj.getTime())) return null;
    return format(dateObj, "d MMM yyyy, HH:mm");
  }, [photo.dateTimeOriginal]);

  const cameraName = useMemo(() => {
    const parts = [photo.make, photo.model].filter(Boolean);
    if (parts.length === 0) return null;
    // Avoid repeating make if model already includes it
    if (photo.make && photo.model && photo.model.toLowerCase().includes(photo.make.toLowerCase())) {
      return photo.model;
    }
    return parts.join(" ");
  }, [photo.make, photo.model]);

  const locationText = useMemo(() => {
    if (photo.placeFormatted) return photo.placeFormatted;
    const parts = [photo.city, photo.country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : null;
  }, [photo.placeFormatted, photo.city, photo.country]);

  const hasAnyExif = Boolean(
    cameraName ||
    photo.lensModel ||
    formattedFocal ||
    formattedFNumber ||
    formattedShutter ||
    formattedIso ||
    formattedDate ||
    locationText
  );

  if (!hasAnyExif) return null;

  return (
    <div className={cn("transition-all duration-200 select-none", className)}>
      {isOpen && (
        <div
          role="region"
          aria-label="Photo EXIF details"
          className="bg-card/95 backdrop-blur-md border border-border/60 text-card-foreground rounded-xl p-4 shadow-2xl max-w-sm w-full space-y-3"
        >
          {/* Camera & Lens Header */}
          {(cameraName || photo.lensModel) && (
            <div className="flex items-start gap-3 pb-2 border-b border-border/40">
              {photo.make && (
                <div className="pt-0.5 shrink-0">
                  <BrandsLogo brand={photo.make} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                {cameraName && (
                  <p className="text-sm font-semibold truncate leading-tight">
                    {cameraName}
                  </p>
                )}
                {photo.lensModel && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {photo.lensModel}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Exposure & Shooting Specs Grid */}
          {(formattedFocal || formattedFNumber || formattedShutter || formattedIso) && (
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {formattedFocal && (
                <div className="flex items-center gap-2 p-1.5 rounded-md bg-muted/60">
                  <Camera className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{formattedFocal}</span>
                </div>
              )}
              {formattedFNumber && (
                <div className="flex items-center gap-2 p-1.5 rounded-md bg-muted/60">
                  <Aperture className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{formattedFNumber}</span>
                </div>
              )}
              {formattedShutter && (
                <div className="flex items-center gap-2 p-1.5 rounded-md bg-muted/60">
                  <Timer className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{formattedShutter}</span>
                </div>
              )}
              {formattedIso && (
                <div className="flex items-center gap-2 p-1.5 rounded-md bg-muted/60">
                  <Eye className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{formattedIso}</span>
                </div>
              )}
            </div>
          )}

          {/* Location & Date Footer */}
          {(locationText || formattedDate) && (
            <div className="pt-2 border-t border-border/40 space-y-1 text-xs text-muted-foreground">
              {locationText && (
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{locationText}</span>
                </div>
              )}
              {formattedDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>{formattedDate}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
