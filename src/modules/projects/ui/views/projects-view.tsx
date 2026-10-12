"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import CardContainer from "@/components/card-container";
import Footer from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { FeaturedProjectCover } from "../components/featured-project-cover";
import { ProjectCard } from "../components/project-card";

export const ProjectsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.projects.getMany.queryOptions());

  const featured = data.find((p) => p.featured) || data[0];

  return (
    <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row w-full">
      {/* LEFT CONTENT - Fixed */}
      <div className="w-full h-[50vh] lg:w-1/2 lg:fixed lg:top-0 lg:left-0 md:h-[80vh] lg:h-screen p-0 lg:p-3 group">
        <FeaturedProjectCover data={featured} />
      </div>

      {/* Spacer for fixed left content */}
      <div className="hidden lg:block lg:w-1/2" />

      {/* RIGHT CONTENT - Scrollable */}
      <div className="w-full lg:w-1/2 space-y-3 pb-3">
        {/* DESCRIPTION CARD */}
        <CardContainer>
          <div className="flex flex-col p-8 md:p-12 gap-8 md:gap-16">
            <h1 className="text-3xl">Projects</h1>
            <div className="flex flex-col gap-4 font-light text-text-muted leading-relaxed">
              <p>
                Kumpulan studi kasus sistem web, aplikasi, dan arsitektur perangkat lunak yang saya kembangkan. Setiap proyek dirancang dengan fokus pada efisiensi, kebutuhan pengguna, dan implementasi kode yang bersih.
              </p>
            </div>
          </div>
        </CardContainer>

        {/* PROJECTS GRID */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
};

export const ProjectsViewLoadingStatus = () => {
  return (
    <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row w-full">
      {/* LEFT CONTENT - Fixed Skeleton */}
      <div className="w-full h-[50vh] lg:w-1/2 lg:fixed lg:top-0 lg:left-0 md:h-[80vh] lg:h-screen p-0 lg:p-3 group">
        <Skeleton className="w-full h-full rounded-xl" />
      </div>

      {/* Spacer for fixed left content */}
      <div className="hidden lg:block lg:w-1/2" />

      {/* RIGHT CONTENT - Scrollable Skeleton */}
      <div className="w-full lg:w-1/2 space-y-3 pb-3">
        <CardContainer>
          <div className="flex flex-col p-8 md:p-12 gap-8 md:gap-16">
            <h1 className="text-3xl">Projects</h1>
            <div className="flex flex-col gap-4 font-light text-text-muted">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-3/4 h-4" />
            </div>
          </div>
        </CardContainer>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="aspect-3/4 rounded-xl overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>
          ))}
        </div>

        <Footer />
      </div>
    </div>
  );
};
