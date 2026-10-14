"use client";

import { useRouter } from "next/navigation";
import BlurImage from "@/components/blur-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import VectorTopLeftAnimation from "@/modules/home/ui/components/vector-top-left-animation";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import { navigateWithViewTransition } from "@/lib/view-transition";
import type { Post } from "@/db/schema";
import { format } from "date-fns";

interface Props {
  post: Post;
}

export const BlogHomeCard = ({ post }: Props) => {
  const router = useRouter();
  const coverUrl = keyToUrl(post.coverImage) || "/placeholder.svg";
  const transitionName = `blog-${post.slug}`;

  return (
    <div
      className="w-full relative group cursor-pointer"
      onClick={() =>
        navigateWithViewTransition(() => router.push(`/blog/${post.slug}`))
      }
    >
      <AspectRatio
        ratio={0.75 / 1}
        className="overflow-hidden rounded-lg relative bg-muted"
        style={{ viewTransitionName: transitionName }}
      >
        <BlurImage
          src={coverUrl}
          alt={post.title}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1535px) 50vw, 33vw"
          quality={70}
          className="object-cover lg:group-hover:blur-xs lg:transition-[filter] lg:duration-300 lg:ease-out"
          blurhash=""
        />

        {/* Floating title and metadata overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 z-10 bg-gradient-to-t from-black/85 via-black/45 to-transparent">
          <p className="text-white text-xs sm:text-sm font-medium line-clamp-2 leading-snug">
            {post.title}
          </p>
          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-white/70">
            <span suppressHydrationWarning>
              {post.createdAt
                ? format(new Date(post.createdAt), "d MMM yyyy")
                : ""}
            </span>
            <span>•</span>
            <span>{post.readingTimeMinutes || 3} min baca</span>
          </div>
        </div>
      </AspectRatio>

      <div className="absolute top-0 left-0 z-20">
        <VectorTopLeftAnimation
          title={
            <span className="truncate max-w-[130px] sm:max-w-[170px] inline-block font-normal">
              {post.tags?.[0] || "Artikel"}
            </span>
          }
        />
      </div>
    </div>
  );
};

export default BlogHomeCard;
