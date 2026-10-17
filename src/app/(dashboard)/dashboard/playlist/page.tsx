import { Suspense } from "react";
import { trpc, getQueryClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  DashboardPlaylistView,
  PlaylistLoadingStatus,
  PlaylistErrorStatus,
} from "@/modules/playlist/ui/views/dashboard-playlist-view";

export const metadata = {
  title: "Playlist Musik",
  description: "Kelola daftar lagu audio player portofolio",
};

const DashboardPlaylistPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.playlist.getMany.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<PlaylistLoadingStatus />}>
        <ErrorBoundary fallback={<PlaylistErrorStatus />}>
          <DashboardPlaylistView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default DashboardPlaylistPage;
