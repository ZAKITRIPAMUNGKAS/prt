import { Suspense } from "react";
import { trpc } from "@/trpc/server";
import { getQueryClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { DiscoverWidget } from "@/modules/discover/ui/components/discover-widget";
import { DiscoverLoading } from "@/modules/discover/ui/views/discover-view";

export const metadata = {
  title: "Discover",
  description:
    "Explore photos on an interactive map. Discover stunning photography from cities and locations around the world.",
};

import { PageEntrance } from "@/components/page-entrance";

const page = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.discover.getManyPhotos.queryOptions({}));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageEntrance className="h-full min-h-[calc(100vh-1.5rem)]">
        <Suspense fallback={<DiscoverLoading />}>
          <ErrorBoundary fallback={<p>Error</p>}>
            <DiscoverWidget />
          </ErrorBoundary>
        </Suspense>
      </PageEntrance>
    </HydrationBoundary>
  );
};

export default page;
