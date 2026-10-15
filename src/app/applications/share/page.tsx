import { Suspense } from "react";
import { trpc, getQueryClient } from "@/trpc/server";
import type { SearchParams } from "nuqs/server";
import { ErrorBoundary } from "react-error-boundary";
import { loadApplicationsSearchParams } from "@/modules/applications/params";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  PublicApplicationsView,
  PublicApplicationsErrorStatus,
  PublicApplicationsLoadingStatus,
} from "@/modules/applications/ui/views/public-applications-view";
import { siteConfig } from "@/site.config";

export const metadata = {
  title: `Pelacak Lamaran Kerja - ${siteConfig.name}`,
  description: `Status dan riwayat pemantauan lamaran kerja ${siteConfig.name} (Pratinjau Publik Read-Only).`,
};

type Props = {
  searchParams: Promise<SearchParams>;
};

const PublicApplicationsPage = async ({ searchParams }: Props) => {
  const filters = await loadApplicationsSearchParams(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.applications.getManyPublic.queryOptions({
      page: filters.page,
      search: filters.search || undefined,
      status: filters.status.length > 0 ? filters.status : undefined,
      platform: filters.platform || undefined,
    })
  );
  void queryClient.prefetchQuery(trpc.applications.getStatsPublic.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<PublicApplicationsLoadingStatus />}>
        <ErrorBoundary fallback={<PublicApplicationsErrorStatus />}>
          <PublicApplicationsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default PublicApplicationsPage;
