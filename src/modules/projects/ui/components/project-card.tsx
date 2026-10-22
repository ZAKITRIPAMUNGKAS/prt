"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import BlurImage from "@/components/blur-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import VectorTopLeftAnimation from "@/modules/home/ui/components/vector-top-left-animation";
import { getProjectCoverUrl, getProjectVideoUrl } from "../../lib/utils";
import { navigateWithViewTransition } from "@/lib/view-transition";
import { getPrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Project } from "@/db/schema";

interface Props {
  project: Pick<Project, "slug" | "title" | "coverKey" | "previewVideoKey">;
}

function subscribeTouch(callback: () => void) {
  const mq = window.matchMedia("(max-width: 1023px)");
  const pointerMq = window.matchMedia("(pointer: coarse)");
  mq.addEventListener("change", callback);
  pointerMq.addEventListener("change", callback);
  return () => {
    mq.removeEventListener("change", callback);
    pointerMq.removeEventListener("change", callback);
  };
}

function getTouchSnapshot() {
  return (
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(max-width: 1023px)").matches
  );
}

export const ProjectCard = ({ project }: Props) => {
  const router = useRouter();
  const coverUrl = getProjectCoverUrl(project.coverKey);
  const videoUrl = getProjectVideoUrl(project.previewVideoKey);
  const transitionName = `project-${project.slug}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const isMobile = useSyncExternalStore(
    subscribeTouch,
    getTouchSnapshot,
    () => false
  );

  // Mobile: Play when visible >= 60% in viewport unless reduced motion or data saver
  useEffect(() => {
    if (!videoUrl || !isMobile || !containerRef.current) return;

    const nav = navigator as unknown as { connection?: { saveData?: boolean } };
    const isSaveData = Boolean(nav.connection?.saveData);
    const isReducedMotion = getPrefersReducedMotion();

    if (isSaveData || isReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          const video = videoRef.current;
          if (video) {
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {});
          }
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [videoUrl, isMobile]);

  const handleMouseEnter = () => {
    if (!videoUrl || isMobile) return;
    setShouldLoadVideo(true);
    const video = videoRef.current;
    if (video) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (!videoUrl || isMobile) return;
    setIsPlaying(false);
    videoRef.current?.pause();
  };

  return (
    <div
      ref={containerRef}
      className="w-full relative group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() =>
        navigateWithViewTransition(() =>
          router.push(`/projects/${project.slug}`)
        )
      }
    >
      <AspectRatio
        ratio={0.75 / 1}
        className="overflow-hidden rounded-lg relative bg-muted"
        style={{ viewTransitionName: transitionName }}
      >
        <BlurImage
          src={coverUrl}
          alt={project.title}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1535px) 50vw, 33vw"
          quality={70}
          className={cn(
            "object-cover lg:transition-[filter] lg:duration-300 lg:ease-out",
            isPlaying ? "lg:blur-none" : "lg:group-hover:blur-xs"
          )}
          blurhash=""
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
      </AspectRatio>

      {/* Mobile video teaser indicator */}
      {videoUrl && !isPlaying && (
        <div
          className="absolute top-2.5 right-2.5 z-20 md:hidden bg-black/40 backdrop-blur-xs rounded-full p-1.5 text-white/90 shadow-sm"
          aria-label="Video preview tersedia"
        >
          <Play className="size-3 fill-current" />
        </div>
      )}

      <div className="absolute top-0 left-0 z-20">
        <VectorTopLeftAnimation title={project.title} />
      </div>
    </div>
  );
};

export default ProjectCard;
