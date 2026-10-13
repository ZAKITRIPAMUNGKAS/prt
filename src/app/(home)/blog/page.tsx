import { Suspense } from "react";
import { trpc } from "@/trpc/server";
import { getQueryClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  BlogView,
  BlogViewLoadingStatus,
} from "@/modules/blog/ui/views/blog-view";

export const metadata = {
  title: "Blog",
  description: "Blog",
};

import { PageEntrance } from "@/components/page-entrance";

const page = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.blog.getMany.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageEntrance>
        <Suspense fallback={<BlogViewLoadingStatus />}>
          <ErrorBoundary fallback={<p>Error</p>}>
            <BlogView />
          </ErrorBoundary>
        </Suspense>
      </PageEntrance>
    </HydrationBoundary>
  );
};

export default page;
