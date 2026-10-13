import { Suspense } from "react";
import { trpc, getQueryClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  ProjectsView,
  ProjectsViewLoadingStatus,
} from "@/modules/projects/ui/views/projects-view";

export const metadata = {
  title: "Projects",
  description:
    "Portofolio studi kasus dan pengembangan sistem web oleh Zaki Tri Pamungkas.",
};

import { PageEntrance } from "@/components/page-entrance";

const ProjectsPage = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.projects.getMany.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageEntrance>
        <Suspense fallback={<ProjectsViewLoadingStatus />}>
          <ErrorBoundary fallback={<p>Terjadi kesalahan saat memuat proyek</p>}>
            <ProjectsView />
          </ErrorBoundary>
        </Suspense>
      </PageEntrance>
    </HydrationBoundary>
  );
};

export default ProjectsPage;
