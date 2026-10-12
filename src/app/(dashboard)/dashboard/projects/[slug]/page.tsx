import { Metadata } from "next";
import { Suspense } from "react";
import { trpc, getQueryClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { EditProjectView } from "@/modules/projects/ui/views/edit-project-view";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const queryClient = getQueryClient();

  try {
    const project = await queryClient.fetchQuery(
      trpc.projects.getBySlug.queryOptions({
        slug: decodedSlug,
      })
    );

    return {
      title: `Edit: ${project.title}`,
    };
  } catch {
    return {
      title: "Edit Proyek",
    };
  }
}

const EditProjectPage = async ({ params }: Props) => {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const queryClient = getQueryClient();

  await queryClient.fetchQuery(
    trpc.projects.getBySlug.queryOptions({
      slug: decodedSlug,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<p className="p-8 text-center text-destructive">Gagal memuat proyek</p>}>
        <Suspense fallback={<p className="p-8 text-center text-muted-foreground">Memuat data...</p>}>
          <EditProjectView slug={decodedSlug} />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
};

export default EditProjectPage;
