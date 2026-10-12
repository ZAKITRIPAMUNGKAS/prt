"use client";

// External dependencies
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PiArrowUpRight } from "react-icons/pi";

// UI Components
import BlurImage from "@/components/blur-image";
import VectorCombined from "@/components/vector-combined";
import { Badge } from "@/components/ui/badge";
import { postsGetMany } from "@/modules/blog/types";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import { navigateWithViewTransition } from "@/lib/view-transition";

interface LatestPostSectionProps {
  data?: postsGetMany[0];
}

export const LatestPostSection = ({ data }: LatestPostSectionProps) => {
  const router = useRouter();

  if (!data) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-muted rounded-xl p-8 text-center">
        <p className="text-base font-normal">Belum ada artikel</p>
        <p className="text-sm text-text-muted mt-1 font-light">
          Artikel terbaru akan tampil di sini setelah diterbitkan.
        </p>
      </div>
    );
  }

  const coverUrl = keyToUrl(data.coverImage) || "/placeholder.svg";
  const transitionName = `blog-${data.slug}`;

  return (
    <Link
      href={`/blog/${data.slug}`}
      onClick={(e) => {
        e.preventDefault();
        navigateWithViewTransition(() => router.push(`/blog/${data.slug}`));
      }}
      className="block w-full h-full relative rounded-xl overflow-hidden group cursor-pointer bg-muted"
      style={{ viewTransitionName: transitionName }}
    >
      <BlurImage
        src={coverUrl}
        alt={data.title || "Blog post"}
        fill
        quality={80}
        sizes="(max-width: 1023px) 100vw, 50vw"
        className="object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
      />

      {/* Vector combined badge in bottom-right */}
      <div className="absolute right-0 bottom-0 pointer-events-none z-10">
        <VectorCombined
          title={data.tags?.[0] || "Artikel"}
          position="bottom-right"
        />
      </div>

      {/* Floating Info Overlay in bottom-left */}
      <div className="absolute left-0 bottom-0 p-3 md:p-4 z-20 max-w-[calc(100%-120px)] md:max-w-md">
        <div className="bg-background/90 dark:bg-background/80 backdrop-blur-md p-4 rounded-xl border border-border/40 shadow-sm flex flex-col gap-2 transition-colors group-hover:border-border">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[11px] font-normal px-2 py-0.5">
              Terbaru
            </Badge>
            <span className="text-xs text-text-muted font-light">
              {data.readingTimeMinutes || 3} min baca
            </span>
          </div>

          <h2 className="text-base md:text-lg font-medium leading-snug line-clamp-2 text-foreground">
            {data.title}
          </h2>

          <div className="flex items-center gap-1 text-xs font-medium text-foreground pt-1">
            <span>Baca artikel</span>
            <PiArrowUpRight
              size={14}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

