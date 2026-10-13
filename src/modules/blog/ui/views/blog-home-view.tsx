"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import VectorTopLeftAnimation from "@/modules/home/ui/components/vector-top-left-animation";
import { BlogHomeCard } from "../components/blog-card";

export const BlogHomeView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.blog.getMany.queryOptions());

  if (!data || data.length === 0) {
    return null;
  }

  // Display the 3 latest blog posts
  const posts = data.slice(0, 3);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3">
      {posts.map((post) => (
        <BlogHomeCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export const BlogHomeLoadingStatus = () => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="w-full relative group cursor-pointer">
          <AspectRatio
            ratio={0.75 / 1}
            className="overflow-hidden rounded-lg relative bg-muted"
          >
            <Skeleton className="w-full h-full" />
          </AspectRatio>
          <div className="absolute top-0 left-0 z-20">
            <VectorTopLeftAnimation
              title={
                <span className="inline-block w-16 h-3.5 bg-muted-foreground/20 rounded-sm animate-pulse my-0.5" />
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
};
