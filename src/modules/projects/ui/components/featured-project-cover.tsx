"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/db/schema";
import { getProjectCoverUrl, getProjectVideoUrl } from "../../lib/utils";
import { navigateWithViewTransition } from "@/lib/view-transition";
import { cn } from "@/lib/utils";

interface FeaturedProjectCoverProps {
  data?: Project;
}

export const FeaturedProjectCover = ({ data }: FeaturedProjectCoverProps) => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  if (!data) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted rounded-xl">
        <p className="text-muted-foreground text-sm font-light">
          Belum ada proyek
        </p>
      </div>
    );
  }

  const coverUrl = getProjectCoverUrl(data.coverKey);
  const videoUrl = getProjectVideoUrl(data.previewVideoKey);
  const transitionName = `project-${data.slug}`;

  const handleMouseEnter = () => {
    if (!videoUrl) return;
    setShouldLoadVideo(true);
    videoRef.current
      ?.play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  };

  const handleMouseLeave = () => {
    if (!videoUrl) return;
    setIsPlaying(false);
    videoRef.current?.pause();
  };

  return (
    <Link
      href={`/projects/${data.slug}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        e.preventDefault();
        navigateWithViewTransition(() => router.push(`/projects/${data.slug}`));
      }}
      style={{ viewTransitionName: transitionName }}
      className="block w-full h-full relative rounded-xl overflow-hidden group cursor-pointer"
    >
      <Image
        src={coverUrl}
        alt={data.title}
        fill
        unoptimized
        priority
        className={cn(
          "object-cover transition-[filter] duration-300 ease-out",
          isPlaying ? "" : "group-hover:blur-xs"
        )}
      />

      {videoUrl && (
        <video
          ref={videoRef}
          src={shouldLoadVideo ? videoUrl : undefined}
          muted
          loop
          playsInline
          preload="none"
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-200 pointer-events-none z-10",
            isPlaying ? "opacity-100" : "opacity-0"
          )}
        />
      )}

      <div className="absolute w-full bottom-0 p-3">
        <div className="bg-background backdrop-blur-xs p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            {data.featured && (
              <Badge>
                <span className="text-xs font-light">Featured</span>
              </Badge>
            )}
            <h2 className="font-light">{data.title}</h2>
          </div>

          <div className="relative mr-2">
            <span className="text-sm font-light">Studi Kasus</span>
            <div className="absolute bottom-[2px] left-0 w-full h-px bg-black dark:bg-white transition-all duration-300 transform ease-in-out group-hover:w-1/3" />
          </div>
        </div>
      </div>
    </Link>
  );
};
