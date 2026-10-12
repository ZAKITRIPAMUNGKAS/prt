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

  // Skip the first post (already shown in LatestPostSection)
  const postsToShow = data.slice(1);

  if (postsToShow.length === 0) {
    return null;
  }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
      {postsToShow.map((item) => {
        const coverUrl = keyToUrl(item.coverImage) || "/placeholder.svg";
        const transitionName = `blog-${item.slug}`;

        return (
          <AspectRatio ratio={0.75 / 1} key={item.id}>
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
              {item.tags?.[0] && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-2.5 py-1 bg-black/50 backdrop-blur-md text-white rounded-md text-[11px] font-normal tracking-wide uppercase">
                    {item.tags[0]}
                  </span>
                </div>
              )}

              {/* Bottom Card Info Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-3 z-10">
                <div className="bg-background/90 dark:bg-background/80 backdrop-blur-md p-4 rounded-xl border border-border/40 shadow-sm flex flex-col gap-1.5 transition-colors group-hover:border-border">
                  <div className="flex items-center justify-between text-xs text-text-muted font-light">
                    <span>{item.readingTimeMinutes || 3} min baca</span>
                    <PiArrowUpRight
                      size={15}
                      className="text-foreground/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                    />
                  </div>

                  <h2 className="text-sm md:text-[15px] font-medium leading-snug line-clamp-2 text-foreground">
                    {item.title}
                  </h2>
                </div>
              </div>
            </Link>
          </AspectRatio>
        );
      })}
    </div>
  );
};

