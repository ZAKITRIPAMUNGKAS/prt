import { Suspense } from "react";
import { trpc } from "@/trpc/server";
import { getQueryClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import ProfileCard from "@/modules/home/ui/components/profile-card";
import LatestTravelCard from "@/modules/home/ui/components/latest-travel-card";
import { LatestProjectsCard } from "@/modules/projects/ui/components/latest-projects-card";
import {
  ProjectsHomeView,
  ProjectsHomeLoadingStatus,
} from "@/modules/projects/ui/views/projects-home-view";
import Footer from "@/components/footer";

import {
  CitiesView,
  CitiesViewLoadingStatus,
} from "@/modules/home/ui/views/cities-view";
import {
  SliderViewLoadingStatus,
  SliderView,
} from "@/modules/home/ui/views/slider-view";
import { LatestBlogCard } from "@/modules/blog/ui/components/latest-blog-card";
import {
  BlogHomeView,
  BlogHomeLoadingStatus,
} from "@/modules/blog/ui/views/blog-home-view";

import { PageEntrance, StaggerContainer, StaggerItem } from "@/components/page-entrance";

const page = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.home.getManyLikePhotos.queryOptions({ limit: 10 })
  );
  void queryClient.prefetchQuery(
    trpc.home.getCitySets.queryOptions({ limit: 12 })
  );
  void queryClient.prefetchQuery(
    trpc.projects.getMany.queryOptions({ limit: 3 })
  );
  void queryClient.prefetchQuery(
    trpc.blog.getMany.queryOptions()
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col lg:flex-row min-h-screen w-full">
        {/* LEFT CONTENT - Fixed */}
        <PageEntrance
          delay={0.1}
          className="w-full lg:w-1/2 h-[70vh] lg:fixed lg:top-0 lg:left-0 lg:h-screen p-0 lg:p-3"
        >
          <Suspense fallback={<SliderViewLoadingStatus />}>
            <ErrorBoundary fallback={<p>Something went wrong</p>}>
              <SliderView />
            </ErrorBoundary>
          </Suspense>
        </PageEntrance>
        {/* Spacer for fixed left content */}
        <div className="hidden lg:block lg:w-1/2" />
        {/* RIGHT CONTENT - Scrollable */}
        <StaggerContainer
          staggerDelay={0.07}
          className="w-full mt-3 lg:mt-0 lg:w-1/2 space-y-3 pb-3"
        >
          {/* PROFILE CARD  */}
          <StaggerItem>
            <ProfileCard />
          </StaggerItem>

          {/* LAST TRAVEL CARD  */}
          <StaggerItem>
            <LatestTravelCard />
          </StaggerItem>

          {/* CITY SETS CARD  */}
          <StaggerItem>
            <Suspense fallback={<CitiesViewLoadingStatus />}>
              <ErrorBoundary fallback={<p>Something went wrong</p>}>
                <CitiesView />
              </ErrorBoundary>
            </Suspense>
          </StaggerItem>

          {/* LATEST PROJECTS CARD */}
          <StaggerItem>
            <LatestProjectsCard />
          </StaggerItem>

          {/* PROJECTS VIEW */}
          <StaggerItem>
            <Suspense fallback={<ProjectsHomeLoadingStatus />}>
              <ErrorBoundary fallback={<p>Something went wrong</p>}>
                <ProjectsHomeView />
              </ErrorBoundary>
            </Suspense>
          </StaggerItem>

          {/* LATEST BLOG CARD */}
          <StaggerItem>
            <LatestBlogCard />
          </StaggerItem>

          {/* BLOG VIEW */}
          <StaggerItem>
            <Suspense fallback={<BlogHomeLoadingStatus />}>
              <ErrorBoundary fallback={<p>Something went wrong</p>}>
                <BlogHomeView />
              </ErrorBoundary>
            </Suspense>
          </StaggerItem>

          <StaggerItem>
            <Footer />
          </StaggerItem>
        </StaggerContainer>
      </div>
    </HydrationBoundary>
  );
};

export default page;
