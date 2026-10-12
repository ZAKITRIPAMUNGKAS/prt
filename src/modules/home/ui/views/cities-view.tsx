"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import CityCard from "../components/city-card";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import VectorTopLeftAnimation from "../components/vector-top-left-animation";

export const CitiesView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.home.getCitySets.queryOptions({ limit: 12 })
  );

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3">
      {data.map((item) => (
        <CityCard
          key={item.id}
          title={item.city}
          coverPhoto={item.coverPhoto}
        />
      ))}
    </div>
  );
};

export const CitiesViewLoadingStatus = () => {
  return (
    <div className="mt-3 w-full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="w-full relative group cursor-pointer">
          <AspectRatio
            ratio={0.75 / 1}
            className="overflow-hidden rounded-lg relative"
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
