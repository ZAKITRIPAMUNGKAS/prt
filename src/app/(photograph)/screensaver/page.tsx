import { Suspense } from "react";
import { trpc } from "@/trpc/server";
import { getQueryClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  ScreensaverView,
  ScreensaverLoadingStatus,
} from "@/modules/photograph/ui/views/screensaver-view";

export const metadata = {
  title: "Screensaver",
  description: "Screensaver",
};

const page = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.discover.getManyPhotos.queryOptions({}));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ScreensaverLoadingStatus />}>
        <ErrorBoundary fallback={<p>Error</p>}>
          <ScreensaverView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default page;
