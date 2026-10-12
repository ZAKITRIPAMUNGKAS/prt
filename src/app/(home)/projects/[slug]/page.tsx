import { Metadata } from "next";
import { ProjectSlugView } from "@/modules/projects/ui/views/project-slug-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const queryClient = getQueryClient();

  try {
    const data = await queryClient.fetchQuery(
      trpc.projects.getBySlug.queryOptions({ slug: decodedSlug })
    );

    return {
      title: `${data.title} — Studi Kasus Proyek`,
      description: data.summary,
    };
  } catch {
    return {
      title: "Proyek Tidak Ditemukan",
    };
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const queryClient = getQueryClient();

  await queryClient.fetchQuery(
    trpc.projects.getBySlug.queryOptions({ slug: decodedSlug })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p className="p-8 text-center text-sm text-text-muted">Memuat proyek...</p>}>
        <ErrorBoundary fallback={<p className="p-8 text-center text-sm text-destructive">Gagal memuat detail proyek</p>}>
          <ProjectSlugView slug={decodedSlug} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}
