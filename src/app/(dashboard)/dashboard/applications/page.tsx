import { Suspense } from "react";
import { trpc, getQueryClient } from "@/trpc/server";
import type { SearchParams } from "nuqs/server";
import { ErrorBoundary } from "react-error-boundary";
import { loadApplicationsSearchParams } from "@/modules/applications/params";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  DashboardApplicationsView,
  ApplicationsErrorStatus,
  ApplicationsLoadingStatus,
} from "@/modules/applications/ui/views/dashboard-applications-view";

export const metadata = {
  title: "Lamaran Kerja",
  description: "Manajemen dan Pelacakan Lamaran Kerja",
};

type Props = {
  searchParams: Promise<SearchParams>;
};

const DashboardApplicationsPage = async ({ searchParams }: Props) => {
  const filters = await loadApplicationsSearchParams(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.applications.getMany.queryOptions({
      page: filters.page,
      search: filters.search || undefined,
      status: filters.status.length > 0 ? filters.status : undefined,
      platform: filters.platform || undefined,
    })
  );
  void queryClient.prefetchQuery(trpc.applications.getStats.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ApplicationsLoadingStatus />}>
        <ErrorBoundary fallback={<ApplicationsErrorStatus />}>
          <DashboardApplicationsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default DashboardApplicationsPage;
