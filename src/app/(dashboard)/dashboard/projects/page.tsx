import { Suspense } from "react";
import { trpc, getQueryClient } from "@/trpc/server";
import type { SearchParams } from "nuqs/server";
import { ErrorBoundary } from "react-error-boundary";
import { loadSearchParams } from "@/modules/projects/params";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ProjectsListHeader } from "@/modules/projects/ui/components/projects-list-header";
import {
  DashboardProjectsView,
  ErrorStatus,
  LoadingStatus,
} from "@/modules/projects/ui/views/dashboard-projects-view";

export const metadata = {
  title: "Projects",
  description: "Manajemen Proyek Portofolio",
};

type Props = {
  searchParams: Promise<SearchParams>;
};

const DashboardProjectsPage = async ({ searchParams }: Props) => {
  const filters = await loadSearchParams(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.projects.getManyAdmin.queryOptions({ ...filters })
  );

  return (
    <>
      <ProjectsListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<LoadingStatus />}>
          <ErrorBoundary fallback={<ErrorStatus />}>
            <DashboardProjectsView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default DashboardProjectsPage;
