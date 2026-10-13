import { Suspense } from "react";
import { trpc } from "@/trpc/server";
import { getQueryClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  TravelView,
  LoadingStatus,
} from "@/modules/travel/ui/views/travel-view";

export const metadata = {
  title: "Travel",
  description:
    "Browse travel photography by city. Explore beautiful destinations and discover photos from around the world.",
};

import { PageEntrance } from "@/components/page-entrance";

const page = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.travel.getCitySets.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageEntrance>
        <Suspense fallback={<LoadingStatus />}>
          <ErrorBoundary fallback={<p>Error</p>}>
            <TravelView />
          </ErrorBoundary>
        </Suspense>
      </PageEntrance>
    </HydrationBoundary>
  );
};

export default page;
