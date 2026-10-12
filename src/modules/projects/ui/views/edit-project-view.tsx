"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ProjectForm } from "../components/project-form";

export const EditProjectView = ({ slug }: { slug: string }) => {
  const trpc = useTRPC();
  const { data: project } = useSuspenseQuery(
    trpc.projects.getBySlug.queryOptions({ slug })
  );

  return (
    <div className="py-4 px-4 md:px-8 max-w-5xl">
      <ProjectForm project={project} />
    </div>
  );
};
