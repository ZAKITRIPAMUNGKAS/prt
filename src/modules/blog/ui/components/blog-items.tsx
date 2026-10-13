"use client";

// External dependencies
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PiArrowUpRight } from "react-icons/pi";

// Internal dependencies - UI Components
import { AspectRatio } from "@/components/ui/aspect-ratio";
import BlurImage from "@/components/blur-image";
import { postsGetMany } from "@/modules/blog/types";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import { navigateWithViewTransition } from "@/lib/view-transition";

interface PostsSectionProps {
  data: postsGetMany;
}

export const PostsSection = ({ data }: PostsSectionProps) => {
  const router = useRouter();

  if (!data || data.length === 0) {
    return null;
  }

  // Show all posts in the list, with the latest tagged
  const postsToShow = data;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-medium text-text-muted">Semua Artikel</h2>
        <span className="text-xs text-text-muted font-light">
          {postsToShow.length} tulisan
        </span>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
        {postsToShow.map((item, index) => {
          const coverUrl = keyToUrl(item.coverImage) || "/placeholder.svg";
          const transitionName = `blog-${item.slug}`;
          const isLatest = index === 0;

          return (
            <AspectRatio ratio={0.88 / 1} key={item.id}>
              <Link
                href={`/blog/${item.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigateWithViewTransition(() =>
                    router.push(`/blog/${item.slug}`)
                  );
                }}
                className="block w-full h-full relative rounded-xl overflow-hidden group cursor-pointer bg-muted"
                style={{ viewTransitionName: transitionName }}
              >
                <BlurImage
                  src={coverUrl}
                  alt={item.title || "Blog post"}
                  fill
                  quality={75}
                  sizes="(max-width: 767px) 100vw, (max-width: 1535px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Tag pill at top-right */}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                  {isLatest && (
                    <span className="px-2 py-0.5 bg-primary text-black dark:text-white rounded-md text-[10px] font-semibold tracking-wide uppercase shadow-xs">
                      Terbaru
                    </span>
                  )}
                  {item.tags?.[0] && (
                    <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md text-white rounded-md text-[10px] font-normal tracking-wide uppercase">
                      {item.tags[0]}
                    </span>
                  )}
                </div>

                {/* Bottom Card Info Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-2.5 z-10">
                  <div className="bg-background/90 dark:bg-background/85 backdrop-blur-md p-3.5 rounded-xl border border-border/40 shadow-xs flex flex-col gap-1 transition-colors group-hover:border-border">
                    <div className="flex items-center justify-between text-xs text-text-muted font-light">
                      <span>{item.readingTimeMinutes || 3} min baca</span>
                      <PiArrowUpRight
                        size={14}
                        className="text-foreground/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                      />
                    </div>

                    <h2 className="text-sm font-medium leading-snug line-clamp-2 text-foreground">
                      {item.title}
                    </h2>
                  </div>
                </div>
              </Link>
            </AspectRatio>
          );
        })}
      </div>
    </div>
  );
};
